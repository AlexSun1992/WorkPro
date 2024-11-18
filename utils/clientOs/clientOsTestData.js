export const clientOsTestData = {
  variantA: {
    navigator: {
      userAgentData: {
        "brands": [
          {
            "brand": "Not/A)Brand",
            "version": "8"
          },
          {
            "brand": "Chromium",
            "version": "126"
          },
          {
            "brand": "Google Chrome",
            "version": "126"
          }
        ],
        "mobile": false,
        "platform": "Windows"
      },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    }

  },
  variantB: {
    navigator: {
      userAgentData: "",
      userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
    }
  },
  variantC: {
    navigator: {
      userAgentData: "",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    }
  },
  variantD: {
    navigator: {
      userAgentData: "",
      userAgent: "",
    }
  }
}
