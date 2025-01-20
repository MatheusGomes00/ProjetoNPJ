package com.npj.ProjetoNPJ.documentos;

import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Configuration
public class GoogleDriveConfig {

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    @Value("${google.credentials.path}")
    private String credentialsPath;

    @Value("${google.application.name}")
    private String applicationName;

    @Bean
    public Drive getDriveService() throws GeneralSecurityException, IOException {
        // Carregar credenciais do arquivo JSON
        GoogleCredentials credentials = GoogleCredentials
                .fromStream(new FileInputStream(credentialsPath))
                .createScoped(Collections.singleton(DriveScopes.DRIVE));

        // Configurar e retornar o cliente Drive
        return new Drive.Builder(
                new NetHttpTransport(),
                JSON_FACTORY,
                new HttpCredentialsAdapter(credentials)
        )
                .setApplicationName(applicationName)
                .build();
    }
}
