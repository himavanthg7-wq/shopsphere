package com.shopsphere.service;

import com.shopsphere.dto.request.AddressRequest;
import com.shopsphere.entity.Address;
import com.shopsphere.entity.User;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.AddressRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public List<Address> getAddressesForUser(Long userId) {
        return addressRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Address getAddressById(Long addressId, Long userId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));
        if (!address.getUser().getId().equals(userId)) {
            throw new BadRequestException("Address does not belong to this user.");
        }
        return address;
    }

    @Transactional
    public Address createAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<Address> existing = addressRepository.findByUserIdOrderByCreatedAtDesc(userId);

        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry() != null ? request.getCountry() : "India");
        address.setAddressType(request.getAddressType() != null ? request.getAddressType() : "HOME");

        boolean isDefault = Boolean.TRUE.equals(request.getIsDefault()) || existing.isEmpty();
        if (isDefault) {
            existing.forEach(a -> a.setIsDefault(false));
            addressRepository.saveAll(existing);
        }
        address.setIsDefault(isDefault);

        return addressRepository.save(address);
    }

    @Transactional
    public Address updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = getAddressById(addressId, userId);
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        if (request.getCountry() != null) address.setCountry(request.getCountry());
        if (request.getAddressType() != null) address.setAddressType(request.getAddressType());

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            List<Address> existing = addressRepository.findByUserIdOrderByCreatedAtDesc(userId);
            existing.forEach(a -> a.setIsDefault(false));
            addressRepository.saveAll(existing);
            address.setIsDefault(true);
        }

        return addressRepository.save(address);
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = getAddressById(addressId, userId);
        addressRepository.delete(address);
    }
}
