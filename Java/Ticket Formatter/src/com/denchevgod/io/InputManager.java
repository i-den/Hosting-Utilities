package com.denchevgod.io;

import java.io.File;
import java.util.Arrays;
import java.util.Scanner;

public class InputManager {

    private Scanner scanner;

    public InputManager() {
        this.scanner = new Scanner(System.in);
    }

    public File getScanFile() {
        File currWorkDir = new File(".");

        File[] currWorkDirFilesAndDirs = currWorkDir.listFiles();
        if (currWorkDirFilesAndDirs == null) {
            return null;
        }

        File[] currWorkDirFiles = Arrays.stream(currWorkDirFilesAndDirs)
                .filter(f -> !f.isDirectory())
                .toArray(File[]::new);
        if (currWorkDirFiles.length == 0) {
            return null;
        }

        int scanFileIndexFromInput = -1;
        for (int i = 0; i < currWorkDirFiles.length; i++) {
            System.out.printf("[%d] %s%n", i + 1, currWorkDirFiles[i].getName());
        }
        scanFileIndexFromInput += Integer.parseInt(scanner.nextLine());
        return currWorkDirFiles[scanFileIndexFromInput];
    }
}
