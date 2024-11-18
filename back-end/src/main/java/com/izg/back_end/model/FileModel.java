package com.izg.back_end.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "file")
@Data
public class FileModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_idx")
    private int fileIdx;

    @Column(name = "family_idx")
    private int familyIdx;
    
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "entity_type")
    private String entityType;
    
    @Column(name = "entity_idx")
    private int entityIdx;
    
    @Column(name = "file_rname")
    private String fileRname;
    
    @Column(name = "file_uname")
    private String fileUname;
    
    @Column(name = "file_ext")
    private String fileExtension;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Lob
    @Column(name = "file_data", columnDefinition = "LONGBLOB")
    private byte[] fileData;
    
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt = LocalDateTime.now(); // 기본값 현재 날짜와 시간

}
