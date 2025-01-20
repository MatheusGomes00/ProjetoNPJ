package com.npj.ProjetoNPJ;

import com.google.api.services.drive.Drive;
import com.npj.ProjetoNPJ.documentos.GoogleDriveConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class DriveApiTest {

    @Autowired
    private GoogleDriveConfig googleDriveConfig;

    @Test
    public void testGoogleDriveConfig() {
        try {
            Drive driveService = googleDriveConfig.getDriveService();
            // Verifique se o serviço foi criado com sucesso
            assertNotNull(driveService, "Google Drive service should not be null");
            System.out.println("Conexão com o Google Drive bem-sucedida!");
        } catch (Exception e) {
            System.err.println("Erro ao configurar o cliente do Google Drive: " + e.getMessage());
        }
    }
}