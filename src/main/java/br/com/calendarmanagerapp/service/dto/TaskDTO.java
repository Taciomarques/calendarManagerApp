package br.com.calendarmanagerapp.service.dto;

import br.com.calendarmanagerapp.domain.enumeration.PriorityTask;
import br.com.calendarmanagerapp.domain.enumeration.Status;
import br.com.calendarmanagerapp.domain.enumeration.TypeTask;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link br.com.calendarmanagerapp.domain.Task} entity.
 */
public class TaskDTO implements Serializable {

    private Long id;

    private String title;

    private String description;

    private TypeTask type;

    private Status status;

    private String link;

    private String notes;

    private AttachmentDTO attachment;

    private PriorityTask priority;

    private EventDTO event;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TypeTask getType() {
        return type;
    }

    public void setType(TypeTask type) {
        this.type = type;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public AttachmentDTO getAttachment() {
        return attachment;
    }

    public void setAttachment(AttachmentDTO attachment) {
        this.attachment = attachment;
    }

    public PriorityTask getPriority() {
        return priority;
    }

    public void setPriority(PriorityTask priority) {
        this.priority = priority;
    }

    public EventDTO getEvent() {
        return event;
    }

    public void setEvent(EventDTO event) {
        this.event = event;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TaskDTO)) {
            return false;
        }

        TaskDTO taskDTO = (TaskDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, taskDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TaskDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", type='" + getType() + "'" +
            ", status='" + getStatus() + "'" +
            ", link='" + getLink() + "'" +
            ", notes='" + getNotes() + "'" +
            ", attachments='" + getAttachment() + "'" +
            ", priority='" + getPriority() + "'" +
            ", event=" + getEvent() +
            "}";
    }
}
