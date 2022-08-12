package br.com.calendarmanagerapp.service;

import br.com.calendarmanagerapp.domain.Event;
import br.com.calendarmanagerapp.domain.Task;
import br.com.calendarmanagerapp.repository.EventRepository;
import br.com.calendarmanagerapp.repository.TaskRepository;
import br.com.calendarmanagerapp.repository.UserRepository;
import br.com.calendarmanagerapp.security.SecurityUtils;
import br.com.calendarmanagerapp.service.dto.EventDTO;
import br.com.calendarmanagerapp.service.mapper.EventMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Event}.
 */
@Service
@Transactional
public class EventService {

    private final Logger log = LoggerFactory.getLogger(EventService.class);

    private final EventRepository eventRepository;

    private final EventMapper eventMapper;

    private final TaskRepository taskRepository;

    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, EventMapper eventMapper, TaskRepository taskRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.eventMapper = eventMapper;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    /**
     * Save a event.
     *
     * @param eventDTO the entity to save.
     * @return the persisted entity.
     */
    public EventDTO save(EventDTO eventDTO) {
        log.debug("Request to save Event : {}", eventDTO);
        Event event = eventMapper.toEntity(eventDTO);
        event.getTasks().forEach(task -> {
            if (!taskRepository.existsById(task.getId())) {
                task.setId(null);
            }
        });
        event.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().get()).get());
        if (event.getTasks() != null && !event.getTasks().isEmpty()) {
            for (Task task: event.getTasks()) {
                task.setEvent(event);
            }
        }
        event = eventRepository.save(event);
        return eventMapper.toDto(event);
    }

    /**
     * Update a event.
     *
     * @param eventDTO the entity to save.
     * @return the persisted entity.
     */
    public EventDTO update(EventDTO eventDTO) {
        log.debug("Request to save Event : {}", eventDTO);
        Event event = eventMapper.toEntity(eventDTO);
        event.getTasks().forEach(task -> {
            if (!taskRepository.existsById(task.getId())) {
                task.setId(null);
            }
        });
        if (event.getTasks() != null && !event.getTasks().isEmpty()) {
            for (Task task: event.getTasks()) {
                task.setEvent(event);
            }
        }
        event = eventRepository.save(event);
        return eventMapper.toDto(event);
    }

    /**
     * Partially update a event.
     *
     * @param eventDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<EventDTO> partialUpdate(EventDTO eventDTO) {
        log.debug("Request to partially update Event : {}", eventDTO);
        return eventRepository
            .findById(eventDTO.getId())
            .map(existingEvent -> {
                eventMapper.partialUpdate(existingEvent, eventDTO);

                return existingEvent;
            })
            .map(eventRepository::save)
            .map(eventMapper::toDto);
    }

    /**
     * Get all the events.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<EventDTO> findAllByUserLogin() {
        log.debug("Request to get all Events");
        return eventRepository.findAllByUserLogin(SecurityUtils.getCurrentUserLogin().get()).stream().map(eventMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one event by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<EventDTO> findOne(Long id) {
        log.debug("Request to get Event : {}", id);
        return eventRepository.findById(id).map(eventMapper::toDto);
    }

    /**
     * Delete the event by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Event : {}", id);
        eventRepository.deleteById(id);
    }
}
