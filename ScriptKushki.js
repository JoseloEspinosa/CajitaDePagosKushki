var kushki = new KushkiCheckout({
  kformId: "fBNZz7XhK", // Reemplaza "fBNZz7XhK" por el identificador correcto de tu Kajita
  form: "my-form",
  publicMerchantId: "594f2070d43649e1aec47d9f8f5d72d0", // Reemplaza "594f2070d43649e1aec47d9f8f5d72d0" por tu credencial pública
  amount: "32.70",
  currency: "USD",
  payment_methods: ["credit-card"], // Métodos de pago habilitados
  is_subscription: true,
  inTestEnvironment: true,
});

kushki.requestSubscriptionToken()
  .then(function (response) {
    var subscriptionToken = response.token;

    var nombreCliente = document.getElementById("cardHolderName").value;
    var numeroTarjeta = document.getElementById("cardNumber").value;
    var fechaCaducidad = document.getElementById("expirationDate").value;
    var cvc = document.getElementById("cvc").value;

    var requestOptions = {
      method: "POST",
      url: "https://api-uat.kushkipagos.com/subscriptions/v1/card",
      headers: {
        "Private-Merchant-Id": "ef50661210954743a5db89079b87cd7a", // Reemplaza esto por tu Private Key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: subscriptionToken,
        amount: {
          subtotalIva: 0,
          subtotalIva0: 14.99,
          ice: 0,
          iva: 0,
          currency: "USD",
        },
        planName: "Premium",
        periodicity: "monthly",
        contactDetails: {
          firstName: nombreCliente,
          lastName: "Flores",
          email: "pruebas@kushki.com",
          phoneNumber: "+593984775632",
        },
        startDate: "2023-09-25",
        metadata: { contractID: "157AB" },
      }),
      json: true,
    };

    return request(requestOptions);
  })
  .then(function (response) {
    var subscriptionId = response.subscriptionId;

    var preAuthRequestOptions = {
      method: "POST",
      url: `https://api-uat.kushkipagos.com/subscriptions/v1/${subscriptionId}/preauthorizations`,
      headers: {
        "Private-Merchant-Id": "ef50661210954743a5db89079b87cd7a", // Reemplaza esto por tu Private Key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: {
          subtotalIva: 0,
          subtotalIva0: 14.99,
          ice: 0,
          iva: 0,
          currency: "USD",
        },
      }),
      json: true,
    };

    return request(preAuthRequestOptions);
  })
  .then(function (response) {
    var preAuthorizationId = response.preAuthorizationId;

    var captureRequestOptions = {
      method: "POST",
      url: `https://api-uat.kushkipagos.com/preauthorizations/v1/${preAuthorizationId}/capture`,
      headers: {
        "Private-Merchant-Id": "ef50661210954743a5db89079b87cd7a", // Reemplaza esto por tu Private Key
        "Content-Type": "application/json",
      },
      json: true,
    };

    return request(captureRequestOptions);
  })
  .then(function (response) {
    var subscriptionId = response.subscriptionId;

    var subscriptionInfoRequestOptions = {
      method: "GET",
      url: `https://api-uat.kushkipagos.com/subscriptions/v1/${subscriptionId}`,
      headers: {
        "Private-Merchant-Id": "ef50661210954743a5db89079b87cd7a", // Reemplaza esto por tu Private Key
        "Content-Type": "application/json",
      },
      json: true,
    };

    return request(subscriptionInfoRequestOptions);
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
