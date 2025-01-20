package com.npj.ProjetoNPJ.documentos;

import com.google.api.services.drive.Drive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TestDriveConfig {

    @Autowired
    private GoogleDriveConfig googleDriveConfig;

    // Método para testar a configuração do cliente Google Drive
    public void testDriveConfiguration() {
        try {
            Drive driveService = googleDriveConfig.getDriveService();
            System.out.println("Cliente do Google Drive configurado com sucesso!");
        } catch (Exception e) {
            System.err.println("Erro ao configurar o cliente do Google Drive: " + e.getMessage());
        }
    }
}
