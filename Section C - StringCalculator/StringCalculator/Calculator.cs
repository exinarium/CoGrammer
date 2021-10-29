using System;
using System.Collections.Generic;
using System.Linq;

namespace StringCalculator.Calculator
{
    /// <summary>
    /// This class is used to do the calculations for the calculator
    /// </summary>
    public class Calculator
    {
        /// <summary>
        /// Return the value sent as a decimal
        /// </summary>
        /// <param name="value"></param>
        /// <returns>decimal</returns>
        protected decimal Value(string value)
        {
            if (string.IsNullOrEmpty(value))
                return 0;

            return Convert.ToDecimal(value);
        }

        /// <summary>
        /// Determine the factorial of any value
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        protected decimal Factorial(string value)
        {
            var total = (decimal)1;

            if (string.IsNullOrEmpty(value))
                return total;

            var n = Convert.ToDecimal(value);

            if (n == 0)
                return total;

            for (var i = n; i > 0; i--)
            {
                total *= i;
            }

            return total;
        }

        /// <summary>
        /// Determine the highest prime number under a value
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        protected long HighestPrimeNumber(string value)
        {
            var primeNumber = 0L;

            if (string.IsNullOrEmpty(value))
                return 0;

            var n = Convert.ToInt64(value);

            if (n == 0)
                return 0;

            for (long i = 2; i <= n; i++)
            {
                if (IsPrimeNumber(i))
                    primeNumber = i;
            }

            return primeNumber;
        }

        /// <summary>
        /// Check if a value is a prime number
        /// </summary>
        /// <param name="n"></param>
        /// <returns></returns>
        protected bool IsPrimeNumber(long n)
        {
            if (n <= 1)
                return false;

            for (long i = 2; i < n; i++)
                if (n % i == 0)
                    return false;

            return true;
        }

        /// <summary>
        /// Return the highest fabonacci number under a value;
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        protected long HighestFabonacciNumber(string value)
        {
            var fab = 0L;

            if (string.IsNullOrEmpty(value))
                return 0;

            var n = Convert.ToInt64(value);

            if (n == 0)
                return 0;

            var fabList = FabonacciSequence(n);
            fab = fabList.Max<long>();

            return fab;
        }

        /// <summary>
        /// Returns the sequence of fabonacci numbers under a number
        /// </summary>
        /// <param name="n"></param>
        /// <returns></returns>
        protected List<long> FabonacciSequence(long n)
        {
            var a = 0;
            var b = 1;
            var c = 0;

            var fabList = new List<long>();

            if (n <= 1)
            {
                fabList.Add(0);
                return fabList;
            }

            fabList.Add(a);
            fabList.Add(b);

            while (c < n)
            {
                c = a + b;

                if (c < n)
                    fabList.Add(c);

                a = b;
                b = c;
            }

            return fabList;
        }

        /// <summary>
        /// Add two or more values together
        /// </summary>
        /// <param name="values"></param>
        /// <returns></returns>
        protected decimal Add(params string[] values)
        {
            var total = 0m;
            var count = 1;

            foreach (var val in values)
            {
                if (string.IsNullOrEmpty(val))
                    continue;

                var n = Convert.ToDecimal(val);

                if (count == 1)
                {
                    total = n;
                    count++;
                }
                else
                {
                    total += n;
                }
            }

            return total;
        }

        /// <summary>
        /// Subtract two or more values
        /// </summary>
        /// <param name="values"></param>
        /// <returns></returns>
        protected decimal Subtract(params string[] values)
        {
            var total = 0m;
            var count = 1;

            foreach (var val in values)
            {
                if (string.IsNullOrEmpty(val))
                    continue;

                var n = Convert.ToDecimal(val);

                if (count == 1)
                {
                    total = n;
                    count++;
                }
                else
                {
                    total -= n;
                }
            }

            return total;
        }

        /// <summary>
        /// Multiply two or more values
        /// </summary>
        /// <param name="values"></param>
        /// <returns></returns>
        protected decimal Multiply(params string[] values)
        {
            var total = 0m;
            var count = 1;

            foreach (var val in values)
            {
                if (string.IsNullOrEmpty(val))
                    continue;

                var n = Convert.ToDecimal(val);

                if (count == 1)
                {
                    total = n;
                    count++;
                }
                else
                {
                    total *= n;
                }
            }

            return total;
        }

        /// <summary>
        /// Divide two or more values
        /// </summary>
        /// <param name="values"></param>
        /// <returns></returns>
        protected decimal Divide(params string[] values)
        {
            var total = 0m;
            var count = 1;

            foreach (var val in values)
            {
                if (string.IsNullOrEmpty(val))
                    continue;

                var n = Convert.ToDecimal(val);

                if (n == 0)
                    throw new DivideByZeroException("Division by zero (0) is not allowed");

                if (count == 1)
                {
                    total = n;
                    count++;
                }
                else
                {
                    total /= n;
                }
            }

            return total;
        }

        /// <summary>
        /// Perform the calculation and return the value
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public string Calculate(string value)
        {
            value = value.Trim();

            //Calculate Brackets First
            var startIndex = value.LastIndexOf('(');

            while (startIndex > -1)
            {
                var lastIndex = value.IndexOf(')', startIndex);

                var newValue = value.Substring(startIndex + 1, lastIndex - startIndex - 1);
                var returnValue = Calculate(newValue);

                value = value.Replace(value.Substring(startIndex, lastIndex - startIndex + 1), returnValue);
                startIndex = value.LastIndexOf('(');
            }

            //Remove unnecessary white space
            var split = value.Split(' ');
            var parameters = split.Where(x => !string.IsNullOrEmpty(x.Trim())).ToList();

            //Determine operation
            var operation = parameters[0];

            //Remove operation from parameters
            parameters.RemoveAt(0);
            var paramValues = parameters.ToArray();

            //If no operator found, it is a value operation
            if (Decimal.TryParse(operation, out decimal val))
            {
                return Value(operation).ToString();
            }


            if (paramValues.Length == 0)
                return "0";

            var retVal = 0m;

            //Determine operation
            switch (operation.ToLower())
            {
                case "+":
                    {
                        retVal = this.Add(paramValues);
                        break;
                    }
                case "-":
                    {
                        retVal = this.Subtract(paramValues);
                        break;
                    }
                case "*":
                    {
                        retVal = this.Multiply(paramValues);
                        break;
                    }
                case "/":
                    {
                        retVal = this.Divide(paramValues);
                        break;
                    }
                case "factorial":
                    {
                        retVal = this.Factorial(paramValues[0]);
                        break;
                    }
                case "prime":
                    {
                        retVal = this.HighestPrimeNumber(paramValues[0]);
                        break;
                    }
                case "fibonacci":
                    {
                        retVal = this.HighestFabonacciNumber(paramValues[0]);
                        break;
                    }
                default:
                    {
                        if (Decimal.TryParse(operation, out decimal valDefault))
                        {
                            return Value(operation).ToString();
                        }
                        else if (!string.IsNullOrEmpty(paramValues[0]) && Decimal.TryParse(paramValues[0], out valDefault))
                        {
                            return Value(paramValues[0]).ToString();
                        }
                        else
                        {
                            throw new InvalidOperationException("Operation not supported");
                        }
                    }
            }

            //Remove decimal point if integer
            var stringValue = retVal % 1 == 0 ? Convert.ToInt64(retVal).ToString() : retVal.ToString();
            return stringValue;
        }
    }
}