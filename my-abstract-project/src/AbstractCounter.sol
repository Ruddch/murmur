// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AbstractCounter
 * @dev Enhanced counter smart contract for Abstract with account abstraction support
 * @author Your Name
 * @notice This contract demonstrates best practices for Abstract
 * @custom:security-contact security@yourproject.com
 */
contract AbstractCounter {
    // ============ State Variables ============

    /// @notice Current counter value
    uint256 private _counter;

    /// @notice Contract owner with admin rights
    address private immutable _owner;

    /// @notice Maximum counter value to prevent overflow
    uint256 public constant MAX_COUNTER_VALUE = type(uint256).max - 1000;

    /// @notice Minimum value for the counter
    uint256 public constant MIN_COUNTER_VALUE = 0;

    // ============ Events ============

    /// @notice Emitted when the counter is updated
    /// @param previousValue Previous value
    /// @param newValue New value
    /// @param caller Address that called the function
    event CounterUpdated(
        uint256 indexed previousValue,
        uint256 newValue,
        address indexed caller
    );

    /// @notice Emitted when the counter is reset
    /// @param previousValue Previous value
    /// @param caller Address that called the function
    event CounterReset(uint256 indexed previousValue, address indexed caller);

    /// @notice Emitted when the owner is changed
    /// @param previousOwner Previous owner
    /// @param newOwner New owner
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // ============ Errors ============

    /// @notice Error for unauthorized access
    error Unauthorized();

    /// @notice Error for exceeding the maximum value
    error ExceedsMaxValue();

    /// @notice Error for value below the minimum
    error BelowMinValue();

    /// @notice Error for setting the same value
    error SameValue();

    // ============ Modifiers ============

    /// @notice Modifier to check owner rights
    modifier onlyOwner() {
        if (msg.sender != _owner) revert Unauthorized();
        _;
    }

    /// @notice Modifier to check counter value validity
    modifier validCounterValue(uint256 value) {
        if (value > MAX_COUNTER_VALUE) revert ExceedsMaxValue();
        if (value < MIN_COUNTER_VALUE) revert BelowMinValue();
        _;
    }

    // ============ Constructor ============

    /// @notice Contract constructor
    /// @param initialValue Initial counter value
    constructor(uint256 initialValue) validCounterValue(initialValue) {
        _owner = msg.sender;
        _counter = initialValue;

        emit CounterUpdated(0, initialValue, msg.sender);
    }

    // ============ View Functions ============

    /// @notice Get the current counter value
    /// @return The current counter value
    function getCounter() external view returns (uint256) {
        return _counter;
    }

    /// @notice Get the contract owner
    /// @return The owner address
    function owner() external view returns (address) {
        return _owner;
    }

    // ============ State-Changing Functions ============

    /// @notice Increment the counter by 1
    /// @dev This function is available to all users
    function increment() external {
        uint256 previousValue = _counter;

        // Check for overflow
        if (previousValue >= MAX_COUNTER_VALUE) revert ExceedsMaxValue();

        _counter = previousValue + 1;

        emit CounterUpdated(previousValue, _counter, msg.sender);
    }

    /// @notice Increment the counter by a specified amount
    /// @param amount The amount to increment
    function incrementBy(
        uint256 amount
    ) external validCounterValue(_counter + amount) {
        uint256 previousValue = _counter;
        _counter = previousValue + amount;

        emit CounterUpdated(previousValue, _counter, msg.sender);
    }

    /// @notice Set a new counter value
    /// @param newValue The new counter value
    function setCounter(uint256 newValue) external validCounterValue(newValue) {
        uint256 previousValue = _counter;

        if (previousValue == newValue) revert SameValue();

        _counter = newValue;

        emit CounterUpdated(previousValue, newValue, msg.sender);
    }

    /// @notice Reset the counter to zero (owner only)
    function resetCounter() external onlyOwner {
        uint256 previousValue = _counter;
        _counter = 0;

        emit CounterReset(previousValue, msg.sender);
    }

    /// @notice Set the counter by admin
    /// @param newValue The new counter value
    function adminSetCounter(
        uint256 newValue
    ) external onlyOwner validCounterValue(newValue) {
        uint256 previousValue = _counter;
        _counter = newValue;

        emit CounterUpdated(previousValue, newValue, msg.sender);
    }

    // ============ Emergency Functions ============

    /// @notice Function for Abstract account abstraction compatibility
    /// @dev Allows the contract to receive ETH
    receive() external payable {
        // The contract can receive ETH for Abstract compatibility
    }

    /// @notice Withdraw ETH from the contract (owner only)
    /// @param amount The amount of ETH to withdraw
    function withdrawETH(uint256 amount) external onlyOwner {
        if (amount > address(this).balance) revert();

        (bool success, ) = payable(_owner).call{value: amount}("");
        if (!success) revert();
    }

    // ============ Gas Optimization ============

    /// @notice Batch operation for multiple increments
    /// @param iterations Number of increments
    function batchIncrement(uint256 iterations) external {
        uint256 previousValue = _counter;

        // Check for overflow
        if (previousValue + iterations > MAX_COUNTER_VALUE)
            revert ExceedsMaxValue();

        _counter = previousValue + iterations;

        emit CounterUpdated(previousValue, _counter, msg.sender);
    }
}
