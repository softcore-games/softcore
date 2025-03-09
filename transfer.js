const ethers = require("ethers");

async function transfer(body) {
    try {
        const { senderPrivateKey, recipientAddress, amountInEth } = body;
    
        // Create a new wallet instance from the sender's private key
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
        const wallet = new ethers.Wallet(senderPrivateKey, provider);

        // Get the current nonce for the sender's address
        const nonce = await wallet.getNonce();
        console.log(nonce);
        
        // Create a transaction object
        const tx = {
            to: recipientAddress,
            value: ethers.parseEther(amountInEth),
            // In ethers v6, use 'gas' instead of 'gasLimit'
            gas: 21000n, // Using BigInt for gas value
            maxFeePerGas: (await provider.getFeeData()).maxFeePerGas,
            maxPriorityFeePerGas: (await provider.getFeeData()).maxPriorityFeePerGas,
            nonce: nonce
        };

        // Send the transaction
        const sent = await wallet.sendTransaction(tx);
        const receipt = await sent.wait(1);
        console.log(receipt);

        return { status: 'success', receipt };
    } catch (error) {
        return { status: 'error', error };
    }
};