package com.denchevgod;

import com.denchevgod.io.Config;
import com.denchevgod.io.InputManager;
import com.denchevgod.io.OutputManager;
import com.denchevgod.malware.MalwareController;


import java.io.File;
import java.io.IOException;

public class Main {

    public static void main(String[] args) throws IOException {
        // Parse options
        Config.loadConfig();

        // Get scan file from input
        InputManager inputManager = new InputManager();
        File scanFile = inputManager.getScanFile();

        // Filter scan file and create User <-> Infected Files Map
        MalwareController malwareController = new MalwareController(scanFile);

        try {
            malwareController.createUsers();
        } catch (IOException e) {
            System.out.println(e.getMessage());
            System.exit(-1);
        }

        // Parse template and replace all strings in it. Create a .txt  file for each parsed user
        OutputManager outputManager = new OutputManager();
        outputManager.createTickets(malwareController.getInfectedUsers());
    }
}
