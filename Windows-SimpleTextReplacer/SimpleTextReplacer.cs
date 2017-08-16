using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

class SingleFileReplacer
{
    static void Main()
    {
        // StringBuilder to contain the new text
        StringBuilder editedText = new StringBuilder();
        
        // Get the name of the file that we'll edit. It has to be in the current directory of the file.
        Console.WriteLine("Enter the name of the file that we'll be editing:");
        string sourceFileToEdit = GetFileToChange();
        
        // Get the old string that has to be present in the file that we'll be editing
        string oldStringThatWillBeReplaced = GetOldString(sourceFileToEdit);
        
        // Get the new string that will replace the old one
        Console.WriteLine($"Enter the text that will take the place of \"{oldStringThatWillBeReplaced}\"");
        string newStringThatWillOverwrite = Console.ReadLine();
        

        string[] textToReplace = Regex.Split(File.ReadAllText(sourceFileToEdit), "\r\n");
        
        oldStringThatWillBeReplaced = Regex.Escape(oldStringThatWillBeReplaced);
        
        foreach (var currLine in textToReplace)
        {
            var editedNewLine = Regex.Replace(currLine, oldStringThatWillBeReplaced, newStringThatWillOverwrite);
            editedText.Append(editedNewLine);
            editedText.AppendLine();
        }
        
        CreateNewFile(editedText, sourceFileToEdit);
    }
    
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
    
    private static void CreateNewFile(StringBuilder editedText, string sourceFileToEdit)
    {
        string fileName = sourceFileToEdit.Substring(0, sourceFileToEdit.LastIndexOf('.'));
        string fileExtension = sourceFileToEdit.Substring(sourceFileToEdit.LastIndexOf('.') + 1);
        string newFileToCreate = $"{fileName}-EDITED.{fileExtension}";

        File.WriteAllText(newFileToCreate, editedText.ToString());
        editedText.Clear();
        editedText = null;
    }
}
