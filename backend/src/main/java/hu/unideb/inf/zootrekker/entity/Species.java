package hu.unideb.inf.zootrekker.entity;

import hu.unideb.inf.zootrekker.enums.EWeekdays;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


import java.sql.Timestamp;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name="Species")
public class Species {
    @Id
    @GeneratedValue
    private Long id;
    @Column(unique = true)
    private String name;

    @CreationTimestamp
    @Column(name="created_at", updatable = false, nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp createdAt;
    @Column(name="updated_at")
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp updatedAt;
}
