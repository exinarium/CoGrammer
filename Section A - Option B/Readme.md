## Code Review For do_whilePassword.java

### 1.1 General comments

* Insert spaces between different lines for better readability

* Remove the line of commented code in line 11

* Rather add the operational code to a seperate class and initiate that class inside your main method. 

* Provide a proper summary above the class and the method of the operation performed

### 1.2 Describing issue

* The value from the input dialog is saved in the variable. The issue is the comparison operator being used with the while loop in line 14. Using the != or == operators compares the object references and not the actual value of the String. In the case of a String use the .equals() method instead.

```
while(!choice.equals("John"));
```

### 1.3 Closing Statements

* Remember that the task is not finished as of yet and you still need to complete the additional steps

* You can see the updated code below:

```
    import java.util.*; 
    import javax.swing.*;

    public class do_whilePassword {

    public static void main ( String [] args ) {
        
        String choice = ""; 
        
        do {
            //System.out.println( "Enter today's number from the menu:" );
            choice = JOptionPane.showInputDialog("Please enter in a password");
        }
        while(!choice.equals("John")); 
    } 
}
```
