package com.npj.ProjetoNPJ.documentos;

import com.npj.ProjetoNPJ.documentos.TestDriveConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestControllerDrive {

    @Autowired
    private TestDriveConfig testDriveConfig;

    @GetMapping("/test-drive-connection")
    public String testDriveConnection() {
        testDriveConfig.testDriveConfiguration();
        return "Teste do Google Drive iniciado. Verifique os logs para o resultado.";
    }
}