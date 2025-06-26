// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Clicker {
    address public immutable owner;
    uint256 public totalClicks;
    mapping(address => uint256) public userClicks;
    address[] private users;
    mapping(address => bool) private isUser;

    event Clicked(
        address indexed user,
        uint256 userClicks,
        uint256 totalClicks
    );
    event Reset();

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function click() external {
        if (!isUser[msg.sender]) {
            users.push(msg.sender);
            isUser[msg.sender] = true;
        }
        userClicks[msg.sender] += 1;
        totalClicks += 1;
        emit Clicked(msg.sender, userClicks[msg.sender], totalClicks);
    }

    function reset() external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            userClicks[users[i]] = 0;
        }
        totalClicks = 0;
        emit Reset();
    }

    function getLeaderboard(
        uint256 n
    )
        external
        view
        returns (address[] memory topUsers, uint256[] memory topScores)
    {
        uint256 len = users.length < n ? users.length : n;
        topUsers = new address[](len);
        topScores = new uint256[](len);
        // Simple selection sort for demo purposes
        address[] memory tempUsers = new address[](users.length);
        for (uint256 i = 0; i < users.length; i++) {
            tempUsers[i] = users[i];
        }
        for (uint256 i = 0; i < len; i++) {
            uint256 maxIdx = i;
            for (uint256 j = i + 1; j < users.length; j++) {
                if (userClicks[tempUsers[j]] > userClicks[tempUsers[maxIdx]]) {
                    maxIdx = j;
                }
            }
            topUsers[i] = tempUsers[maxIdx];
            topScores[i] = userClicks[tempUsers[maxIdx]];
            // Swap
            (tempUsers[i], tempUsers[maxIdx]) = (
                tempUsers[maxIdx],
                tempUsers[i]
            );
        }
    }

    function getUserRank(
        address user
    ) external view returns (uint256 rank, uint256 score) {
        if (!isUser[user]) {
            return (0, 0);
        }

        score = userClicks[user];
        rank = 1;

        for (uint256 i = 0; i < users.length; i++) {
            if (users[i] != user && userClicks[users[i]] > score) {
                rank++;
            }
        }
    }

    function getTotalUsers() external view returns (uint256) {
        return users.length;
    }
}
