// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {AbstractCounter} from "../src/AbstractCounter.sol";

contract DeployAbstractScript is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console2.log("=== Abstract Testnet Deployment ===");
        console2.log("Deployer address:", deployer);
        console2.log("Network: Abstract Testnet (Chain ID: 11124)");
        console2.log("RPC URL: https://api.testnet.abs.xyz");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract with initial value 0
        AbstractCounter counter = new AbstractCounter(0);

        vm.stopBroadcast();

        console2.log("=== Deployment Results ===");
        console2.log("Contract deployed at:", address(counter));
        console2.log("Initial counter value:", counter.getCounter());
        console2.log("Contract owner:", counter.owner());

        // Test basic functionality
        console2.log("=== Testing Contract Functionality ===");

        vm.startBroadcast(deployerPrivateKey);

        // Test increment
        counter.increment();
        console2.log("After increment:", counter.getCounter());

        // Test setCounter
        counter.setCounter(10);
        console2.log("After setCounter(10):", counter.getCounter());

        // Test batch increment
        counter.batchIncrement(5);
        console2.log("After batchIncrement(5):", counter.getCounter());

        vm.stopBroadcast();

        console2.log("=== Deployment Complete ===");
        console2.log("Contract is ready for use on Abstract Testnet!");
        console2.log(
            "Block explorer: https://testnet.abscan.org/address/",
            address(counter)
        );
    }
}
