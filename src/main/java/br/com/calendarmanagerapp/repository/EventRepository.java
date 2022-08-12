package br.com.calendarmanagerapp.repository;

import br.com.calendarmanagerapp.domain.Event;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the Event entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByUserLogin(String login);
}
