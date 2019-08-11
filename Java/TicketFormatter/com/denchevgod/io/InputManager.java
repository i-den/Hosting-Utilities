package com.denchevgod.io;

import java.io.File;
import java.util.Arrays;
import java.util.Objects;
import java.util.Scanner;

public final class InputManager {

    private static Scanner scanner = new Scanner(System.in);

    private InputManager() {
        throw new AssertionError("Class InputManager should never be instantiated!");
    }

    /**
     * Prompts the User to select the Malware Scan file and returns it as a File object
     *
     * @return File object representing the Malware Scan file selected by the user
     * @throws NoFilesInDirectoryException if there are no files in the program's directory
     */
    public static File getScanFileFromUserInput() throws NoFilesInDirectoryException {
        try {
            // Obtain all files in the current working directory in a File[] array
            File[] listedFiles = Arrays.stream(Objects.requireNonNull(new File(".").listFiles()))
                    .filter(f -> !f.isDirectory())
                    .toArray(File[]::new);

            return ensureFileIsWithinArray(listedFiles);
        } catch (NullPointerException e) {
            throw new NoFilesInDirectoryException("The program's directory does not contain any files!");
        }
    }

    private static File ensureFileIsWithinArray(File[] listedFiles) {
        // Display all obtained files from the File[] array to the user for selection with an index of +1
        // [1] firstFile.txt
        // [2] secondFile.txt
        for (int i = 0; i < listedFiles.length; i++) {
            System.out.printf("[%d] %s%n", i + 1, listedFiles[i].getName());
        }

        try {
            // Return the File object from the File[] array using the User Input's index
            return listedFiles[Integer.parseInt(scanner.nextLine()) - 1]; // Listed are with an index of +1
        } catch (ArrayIndexOutOfBoundsException e) {
            System.err.println("Incorrect number, try again!");
            ensureFileIsWithinArray(listedFiles);
        }
        return null;
    }
}
