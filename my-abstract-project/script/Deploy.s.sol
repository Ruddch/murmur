// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {AbstractCounter} from "../src/AbstractCounter.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console2.log("Deploying AbstractCounter with deployer:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // Деплоим контракт с начальным значением 0
        AbstractCounter counter = new AbstractCounter(0);

        vm.stopBroadcast();

        console2.log("AbstractCounter deployed at:", address(counter));
        console2.log("Initial counter value:", counter.getCounter());
        console2.log("Contract owner:", counter.owner());

        // Проверяем, что контракт работает
        console2.log("Testing contract functionality...");

        vm.startBroadcast(deployerPrivateKey);

        // Тестируем инкремент
        counter.increment();
        console2.log("After increment:", counter.getCounter());

        // Тестируем установку значения
        counter.setCounter(10);
        console2.log("After setCounter(10):", counter.getCounter());

        // Тестируем пакетный инкремент
        counter.batchIncrement(5);
        console2.log("After batchIncrement(5):", counter.getCounter());

        vm.stopBroadcast();
    }
}
