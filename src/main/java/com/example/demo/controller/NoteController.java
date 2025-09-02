package com.example.demo.controller;

import com.example.demo.entity.Note;
import com.example.demo.repository.NoteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = {
        "http://localhost:3000", // for local testing
        "https://notes-app-web-k790.onrender.com" // deployed frontend
})
public class NoteController {

    private final NoteRepository repo;

    public NoteController(NoteRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Note> getAllNotes() {
        return repo.findAll();
    }

    @PostMapping
    public Note createNote(@RequestBody Note note) {
        return repo.save(note);
    }

    @PutMapping("/{id}")
    public Note updateNote(@PathVariable Long id, @RequestBody Note note) {
        return repo.findById(id).map(n -> {
            n.setTitle(note.getTitle());
            n.setContent(note.getContent());
            return repo.save(n);
        }).orElseThrow(() -> new RuntimeException("Note not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
