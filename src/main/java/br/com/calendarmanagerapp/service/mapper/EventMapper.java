package br.com.calendarmanagerapp.service.mapper;

import br.com.calendarmanagerapp.domain.Event;
import br.com.calendarmanagerapp.service.dto.EventDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Event} and its DTO {@link EventDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class, TaskMapper.class })
public interface EventMapper extends EntityMapper<EventDTO, Event> {

    @Mapping(source = "user.id", target = "userId")
    EventDTO toDto(Event event);

    @Mapping(source = "userId" , target = "user.id")
    Event toEntity(EventDTO eventDTO);

    @Named("eventDtoId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    EventDTO toDtoEventId(Event event);

    @Named("eventEntityId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    Event toEntityEventId(EventDTO event);

}
