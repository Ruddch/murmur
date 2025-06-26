// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {AbstractCounter} from "../src/AbstractCounter.sol";

contract CounterScript is Script {
    AbstractCounter public counter;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Деплоим контракт с начальным значением 0
        counter = new AbstractCounter(0);

        vm.stopBroadcast();
    }
}
