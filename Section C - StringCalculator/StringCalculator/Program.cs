using System;

namespace StringCalculator.Calculator
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                var input = string.Empty;

                do
                {
                    var calculator = new Calculator();
                 
                    Console.WriteLine("\n\nPlease enter the calculation you want to perform or type 'exit' to quit:\n");
                    input = Console.ReadLine();

                    if (input.ToLower() != "exit")
                    {
                        var returnValue = calculator.Calculate(input);
                        Console.WriteLine($"Answer {returnValue}");
                    }
                }
                while (input.ToLower() != "exit");

            }
            catch (DivideByZeroException de)
            {
                Console.WriteLine(de.Message);
            }
            catch (InvalidOperationException ie)
            {
                Console.WriteLine(ie.Message);
            }
            catch (OverflowException)
            {
                Console.WriteLine("The number calculated is too large to process");
            }
            catch (Exception)
            {
                Console.WriteLine("An unexpected exception occurred");
            }
        }
    }
}
