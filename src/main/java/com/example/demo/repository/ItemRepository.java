package com.example.demo.repository;

import com.example.demo.model.Item;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class ItemRepository {

    private final Map<String, Item> itemStore = new ConcurrentHashMap<>();

    public Item save(Item item) {
        if (item.getId() == null || item.getId().isEmpty()) {
            item.setId(UUID.randomUUID().toString());
        }
        itemStore.put(item.getId(), item);
        return item;
    }

    public Optional<Item> findById(String id) {
        return Optional.ofNullable(itemStore.get(id));
    }

    public List<Item> findAll() {
        return new ArrayList<>(itemStore.values());
    }

    public void deleteById(String id) {
        itemStore.remove(id);
    }
}
