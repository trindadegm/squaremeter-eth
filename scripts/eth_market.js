import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";
console.debug("Eth market script");

var accountComboBox = document.getElementById("account");
var voucherTextField = document.getElementById("voucher");
var submitButton = document.getElementById("submit");

submitButton.addEventListener("click", (event) => {
    console.log("Clicked submit");
    buyNFT(() => {
        console.log("done");
    });
})

var globalProvider = null;

async function connectToWallet() {
    if (window.ethereum != null) {
        globalProvider = new ethers.providers.Web3Provider(window.ethereum);
    }
}

async function requestAccounts() {
    try {
        // Request account access if needed
        console.log("Requesting accounts...");
        await globalProvider.send("eth_requestAccounts", []);
        // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // console.log(accounts);
        // for (var i = 0; i < accounts.length; i++) {
        //     accountComboBox.appendChild(new Option("Account #" + (i + 1) + ": " + accounts[i], accounts[i]));
        // }
        // console.log("enabled");
        // Acccounts now exposed
    } catch (error) {
        // User denied account access...
        console.error("Could not access walet");
        throw error;
    }
}

async function buyNFT() {
    console.log("Buying NFT...");
    const voucher = JSON.parse(voucherTextField.value);
    console.log(voucher);
    const abi = [
        "function redeemVoucher(address, (uint256, uint256, string, bytes)) public payable returns (uint256)"
    ];
    const signer = globalProvider.getSigner();
    const contract = new ethers.Contract("0xB00742AFd10AB920b68a0b55bee77E3e9D342Fd7", abi, signer);
    console.log(contract);
    const account = (await globalProvider.send("eth_requestAccounts", []))[0];
    console.log("With account: " + account + "; " + typeof(account));
    const tokenId = await contract.redeemVoucher(account, [voucher.tokenId, voucher.minPrice, voucher.uri, voucher.signature], { gasLimit: 1000000, value: ethers.utils.parseUnits(voucher.minPrice.toString(), "wei") });
    console.log("Redeemed: " + tokenId);
    console.log(tokenId);
}

connectToWallet(function () { console.log("connected") });
requestAccounts(function () { console.log("accouts requested") });

globalProvider.getBlockNumber(function (error, result) {
  console.log(result);
})
