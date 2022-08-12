package br.com.calendarmanagerapp.service.mapper;

import br.com.calendarmanagerapp.domain.Attachment;
import br.com.calendarmanagerapp.service.dto.AttachmentDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity Attachment and its DTO AttachmentDTO.
 */
@Mapper(componentModel = "spring", uses = {  })
public interface AttachmentMapper extends EntityMapper<AttachmentDTO, Attachment> {
}
