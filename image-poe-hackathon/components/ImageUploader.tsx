import { useState } from "react";
import { sha256 } from "js-sha256";
// import { web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
// import { ApiPromise, WsProvider } from "@polkadot/api";

export default function ImageUploader() {
    const [hash, setHash] = useState<string | null>(null);
    const [account, setAccount] = useState<string | null>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const hashHex = sha256(new Uint8Array(arrayBuffer));
            setHash(hashHex);
        };
        reader.readAsArrayBuffer(file);
    };

    const connectWallet = async () => {
        // await web3Enable("Image Hasher");
        // const accounts = await web3Enable("Image Hasher");
        // if (accounts.length > 0) {
        //     setAccount(accounts[0].address);
        // }
    };

    const uploadHash = async () => {
        if (!hash || !account) return;

        // const provider = new WsProvider("wss://rpc.polkadot.io"); // Change to your testnet
        // const api = await ApiPromise.create({ provider });

        // const injector = await web3FromAddress(account);
        // const tx = api.tx.imageHasher.storeHash(hash);

        // await tx.signAndSend(account, { signer: injector.signer });
    };

    return (
        <div>
            <input type="file" onChange={handleImageUpload} />
            {hash && <p>Hash: {hash}</p>}
            <button onClick={connectWallet}>Connect Wallet</button>
            {account && <button onClick={uploadHash}>Upload Hash</button>}
        </div>
    );
}
