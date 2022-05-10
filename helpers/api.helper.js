const axios = require('axios').default

class ApiHelper {
  constructor() {
    this.currencies = process.env.CURRENCIES.split(',')
  }

  async getAtms() {
    let atms = []
    try {
      for (let currency of this.currencies) {
        const response = await this._getResponse(currency)
        const knownAddresses = atms.map(point => point.address)
        for (let atm of this._getPointsFromResponse(response)) {
          if (!knownAddresses.includes(atm.address))
            atms.push(atm)
        }
      }
      return atms
    } catch {
      return
    }
  }

  async _getResponse(currency) {
    const body = {
      "bounds": {
        "bottomLeft": {
          "lat": +process.env.BOTTOM_LEFT_LATITUDE,
          "lng": +process.env.BOTTOM_LEFT_LONGITUDE
        },
        "topRight": {
          "lat": +process.env.TOP_RIGHT_LATITUDE,
          "lng": +process.env.TOP_RIGHT_LONGITUDE
        }
      },
      "filters": {
        "banks": [
          "tcs"
        ],
        "showUnavailable": true,
        "currencies": [
          currency
        ]
      },
      "zoom": +process.env.ZOOM
    }
  
    return axios.post(
      `${process.env.BASE_URL}/geo/withdraw/clusters`,
      body
    )
  }

  _getPointsFromResponse(response) {
    const clusters = response.data.payload.clusters

    let points = []
  
    for (let cluster of clusters) {
      for (let point of cluster.points) {
        const limits = point.atmInfo.limits.map(
          limit => {
            return { currency: limit.currency, amount: limit.amount
          } 
        })

        for (let limit of limits) {
          if (this.currencies.includes(limit.currency) && limit.amount > 0) {
            points.push(point)
            break
          }
        }
      }
    }

    return points
  }
}

module.exports = new ApiHelper()