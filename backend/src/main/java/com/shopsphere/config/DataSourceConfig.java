package com.shopsphere.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        // Render.com and cloud providers often inject postgres:// or postgresql:// URLs
        if (url != null && (url.startsWith("postgres://") || url.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(url);
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath(); // e.g. /shopsphere
                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                config.setJdbcUrl(jdbcUrl);

                if (uri.getUserInfo() != null) {
                    String[] credentials = uri.getUserInfo().split(":", 2);
                    config.setUsername(credentials[0]);
                    if (credentials.length > 1) {
                        config.setPassword(credentials[1]);
                    }
                } else {
                    config.setUsername(username);
                    config.setPassword(password);
                }
            } catch (Exception e) {
                config.setJdbcUrl(url);
                config.setUsername(username);
                config.setPassword(password);
            }
        } else {
            // Standard JDBC URL (MySQL or PostgreSQL)
            config.setJdbcUrl(url);
            config.setUsername(username);
            config.setPassword(password);
        }

        return new HikariDataSource(config);
    }
}
