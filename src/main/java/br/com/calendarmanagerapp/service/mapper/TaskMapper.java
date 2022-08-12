package br.com.calendarmanagerapp.service.mapper;

import br.com.calendarmanagerapp.domain.Task;
import br.com.calendarmanagerapp.service.dto.TaskDTO;
import org.mapstruct.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Mapper for the entity {@link Task} and its DTO {@link TaskDTO}.
 */
@Mapper(componentModel = "spring", uses = { AttachmentMapper.class })
public interface TaskMapper extends EntityMapper<TaskDTO, Task> {
    @Mapping(target = "event", source = "event", ignore = true)
    TaskDTO toDto(Task s);

    @Mapping(source = "event" , target = "event", ignore = true)
    Task toEntity(TaskDTO s);

    default Set<TaskDTO> toDTOList(Set<Task> tasks) {
        Set<TaskDTO> dtoList = new HashSet<>();
        tasks.forEach(task -> dtoList.add(toDto(task)));
        return dtoList;
    }

    default Set<Task> toEntityList(Set<TaskDTO> tasks) {
        Set<Task> entityList = new HashSet<>();
        tasks.forEach(task -> entityList.add(toEntity(task)));
        return entityList;
    }
}
