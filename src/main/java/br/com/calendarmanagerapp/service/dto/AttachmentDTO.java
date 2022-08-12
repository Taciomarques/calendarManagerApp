package br.com.calendarmanagerapp.service.dto;

import java.io.Serializable;

public class AttachmentDTO implements Serializable {

    private Long id;

    private String name;

    private String bytesContentType;

    private byte[] bytes;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBytesContentType() {
        return bytesContentType;
    }

    public void setBytesContentType(String bytesContentType) {
        this.bytesContentType = bytesContentType;
    }

    public byte[] getBytes() {
        return bytes;
    }

    public void setBytes(byte[] bytes) {
        this.bytes = bytes;
    }
}
