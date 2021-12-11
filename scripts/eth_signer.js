import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";
console.debug("Eth signer script");

var idTextField = document.getElementById("token_id");
var contractAddressTextField = document.getElementById("contract_address");
var chainIdTextField = document.getElementById("chain_id");
var uriTextField = document.getElementById("uri");
var priceTextField = document.getElementById("price");
var signButton = document.getElementById("sign_btn");
var resultTextArea = document.getElementById("result_area");

signButton.addEventListener("click", (event) => {
    console.log("Clicked to sign");
    signVoucher(
        idTextField.value,
        contractAddressTextField.value,
        chainIdTextField.value,
        uriTextField.value,
        priceTextField.value
    ).then((signedVoucher) => {
        console.log("Signed");
        const signedVoucherJSON = JSON.stringify(signedVoucher);
        resultTextArea.innerHTML = '<p>' + signedVoucherJSON + '</p>';
    });
});

var globalProvider = null;

async function connectToWallet() {
    if (window.ethereum != null) {
        globalProvider = new ethers.providers.Web3Provider(window.ethereum);
        try {
            // Request account access if needed
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log(accounts);
            for (var i = 0; i < accounts.length; i++) {
                // accountComboBox.appendChild(new Option("Account #" + (i + 1) + ": " + accounts[i], accounts[i]));
            }
            console.log("enabled");
            // Acccounts now exposed
        } catch (error) {
            // User denied account access...
            console.error("Could not access walet");
            throw error;
        }
    }
}

async function signVoucher(tokenId, contractAddress, chainId, uri, price) {
    console.log(uri, price);
    const signer = globalProvider.getSigner();

    const types = {
        NFTVoucher: [
            { name: "tokenId", type: "uint256" },
            { name: "minPrice", type: "uint256" },
            { name: "uri", type: "string" },
        ],
    };
    const domain = {
        name: "HubadubCota-Voucher",
        version: "0.1",
        chainId: parseInt(chainId, 10),
        verifyingContract: contractAddress,
    };

    console.log(signer);
    const voucher = {
        tokenId: parseInt(tokenId, 10),
        // The extra zeros make the gwei into wei
        minPrice: parseInt(price + "000000000", 10),
        uri,
    };
    const voucherJSON = JSON.stringify(voucher);
    console.log("Signing: " + voucherJSON);
    const signature = await signer._signTypedData(domain, types, voucher);
    const signedVoucher = {
        ...voucher,
        signature,
    };
    return signedVoucher;
}

connectToWallet(function () { console.log("connected") });

globalProvider.getBlockNumber(function (error, result) {
  console.log(result);
})

