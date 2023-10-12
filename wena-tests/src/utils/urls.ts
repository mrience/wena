const domain = "https://demo.auroracommerce.com/"

enum endpoints {
    members = "members/"
}

const getUrl = (endpoint?: endpoints) => {
    return endpoint? domain + endpoint: domain;
}

export { getUrl, endpoints }


