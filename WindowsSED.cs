using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;


class SingleFileReplacer
{   
    /// <summary>
    /// Program that replaces all instances of an old string to a new one
    /// </summary>
    static void Main()
    {
        // Initialize the text variable which will contain the new, edited text
        StringBuilder editedText = new StringBuilder();

        // File to edit
        Console.WriteLine("Enter the name of the file that we'll be editing:");
        string sourceFileToEdit = GetFileToChange();

        // Old string
        string oldStringThatWillBeReplaced = GetOldString(sourceFileToEdit);

        // New string
        Console.WriteLine($"Enter the text that will take the place of \"{oldStringThatWillBeReplaced}\"");
        string newStringThatWillOverwrite = Console.ReadLine();

        // Reads the file and splits it by New Line
        string[] textToReplace = Regex.Split(File.ReadAllText(sourceFileToEdit), "\r\n");
        
        // Old string => RegEx
        oldStringThatWillBeReplaced = ConvertToRegex(oldStringThatWillBeReplaced);

        // Initializes a new line with all occurnces of the old string replaced with the new one
        // Appends the initialized new line
        // Adds a New Line character at the end of each line
        foreach (var currLine in textToReplace)
        {
            var editedNewLine = Regex.Replace(currLine, oldStringThatWillBeReplaced, newStringThatWillOverwrite);
            editedText.Append(editedNewLine);
            editedText.AppendLine();
        }

        // Create a new, edited file
        CreateNewFile(editedText, sourceFileToEdit);
    }

    /// <summary>
    /// Gets the file that will be edited. Checks if it exists, if it doesn't asks for new one.
    /// </summary>
    /// <returns>File that contains strings which will be replaced</returns>
    private static string GetFileToChange()
    {
        string fileToReturn = string.Empty;

        while (true)
        {
            fileToReturn = Console.ReadLine();

            if (File.Exists(fileToReturn))
            {
                break;
            }

            Console.WriteLine("FILE DOESN'T EXIST! ENTER NEW FILENAME");
        }

        return fileToReturn;
    }

    /// <summary>
    /// Reads the old string to be replaced. If it's not present asks for a new one.
    /// </summary>
    /// <param name="fileToCheck">The file name that's going to be checked for instances of the old string</param>
    /// <returns>Old string that will be replaced.</returns>
    private static string GetOldString(string fileToCheck)
    {
        var oldString = string.Empty;
        Console.WriteLine("Enter the text that you would like to have replaced:");

        while (true)
        {
            oldString = Console.ReadLine();

            if (File.ReadLines(fileToCheck).Any(line => line.Contains(oldString)))
            {
                break;
            }

            Console.WriteLine("NO MATCH, ENTER NEW STRING:");
        }

        return oldString;
    }

    /// <summary>
    /// Creates a new file that has all instances of the old strings replaced with the new ones
    /// </summary>
    /// <param name="editedText">The text that has all the old strings replaced with the new one</param>
    /// <param name="sourceFileToEdit">The old file that has all old strings</param>
    private static void CreateNewFile(StringBuilder editedText, string sourceFileToEdit)
    {
        string fileName = sourceFileToEdit.Substring(0, sourceFileToEdit.LastIndexOf('.'));
        string fileExtension = sourceFileToEdit.Substring(sourceFileToEdit.LastIndexOf('.') + 1);
        string newFileToCreate = $"{fileName}-EDITED.{fileExtension}";

        File.WriteAllText(newFileToCreate, editedText.ToString());
        editedText.Clear();
        editedText = null;
    }

    /// <summary>
    /// Converts the new string into a RegEx by placing '\' in front of any character that needs to be escaped
    /// </summary>
    /// <param name="oldStringThatWillBeReplaced">The old, unescaped string</param>
    /// <returns>The old string with escaped characters</returns>
    private static string ConvertToRegex(string oldStringThatWillBeReplaced)
    {
        // Initialize the StringBuilder that will contain the Regex
        StringBuilder convertedToRegexText = new StringBuilder();

        // Create the characters that need to be escaped to make the Regex work
        char[] escapedRegexCharacters = new char[]
        {
            '.', '\\', '+', '*', '?', '^', '$', '[', ']', '{', '}', '(', ')', '|', '/'
        };

        // Escape all characters that need to be escaped to make the Regex function properly
        foreach (char currentCharacter in oldStringThatWillBeReplaced)
        {
            if (escapedRegexCharacters.Contains(currentCharacter))
            {
                convertedToRegexText.Append("\\");
            }

            convertedToRegexText.Append(currentCharacter);
        }

        return string.Join("", convertedToRegexText);
    }
}
