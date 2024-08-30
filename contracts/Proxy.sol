// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./common/StorageSlot.sol";
import "./common/Address.sol";

contract Proxy {
    bytes32 private constant IMPLEMENTATION_SLOT =
        bytes32(uint256(keccak256("inbrew.proxy")) - 1);
    bytes32 private constant ADMIN_SLOT =
        bytes32(uint256(keccak256("inbrew.admin")) - 1);

    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    constructor(address _implementation)
        isContract(_implementation)
    {
        StorageSlot.setAddressAt(IMPLEMENTATION_SLOT, _implementation);
        StorageSlot.setAddressAt(ADMIN_SLOT, msg.sender);
    }

    modifier isContract(address _implementation) {
        require(
            Address.isContract(_implementation),
            "_newImplementation is Not ContractAddress!"
        );
        require(
            _implementation != address(0x0),
            "_newImplementation can't Be a Zero Address"
        );
        _;
    }

    modifier onlyAdmin() {
        _checkAdmin();
        _;
    }

    function getImplementation() public view returns (address) {
        return StorageSlot.getAddressAt(IMPLEMENTATION_SLOT);
    }

    function getImplementationSlot() public view onlyAdmin returns (bytes32) {
        return IMPLEMENTATION_SLOT;
    }

    function getAdminSlot() public view onlyAdmin returns (bytes32) {
        return IMPLEMENTATION_SLOT;
    }


    function getAdmin() public view returns (address) {
        return StorageSlot.getAddressAt(ADMIN_SLOT);
    }

    function _checkAdmin() internal view virtual {
        require(getAdmin() == msg.sender, "Caller is not the admin");
    }

    function _delegate(address impl) internal {
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize())

            let result := delegatecall(gas(), impl, ptr, calldatasize(), 0, 0)

            let size := returndatasize()
            returndatacopy(ptr, 0, size)

            switch result
            case 0 {
                revert(ptr, size)
            }
            default {
                return(ptr, size)
            }
        }
    }

    function _setAdmin(address newAdmin) internal {
        StorageSlot.setAddressAt(ADMIN_SLOT, newAdmin);
    }

    receive() external payable{}

    fallback() external payable {
        _delegate(StorageSlot.getAddressAt(IMPLEMENTATION_SLOT));
    }

    function upgrade(address newAddress) public onlyAdmin isContract(newAddress) {
        StorageSlot.setAddressAt(
            IMPLEMENTATION_SLOT,
            newAddress
        );
    }

    function adminTransfer(address newAdmin) public onlyAdmin {
        address oldAdmin = getAdmin();
        _setAdmin(newAdmin);
        emit AdminTransferred(oldAdmin, newAdmin);
    }
}