using System;
using Xunit;

namespace StringCalculator.Tests
{
    public class CalculatorTests : StringCalculator.Calculator.Calculator
    {
        [Fact]
        public void TestValue()
        {
            var inputValue = "3.2";
            var returnValue = Value(inputValue);

            Assert.Equal(returnValue, 3.2m);
        }

        [Fact]
        public void TestAdd_One_Value()
        {
            string[] inputValue = {"12.5"};
            var returnValue = Add(inputValue);

            Assert.Equal(returnValue, 12.5m);
        }

        [Fact]
        public void TestAdd_Three_Values()
        {
            string[] inputValue = {"12.5","12.5","12.5"};
            var returnValue = Add(inputValue);

            Assert.Equal(returnValue, 37.5m);
        }

        [Fact]
        public void TestAdd_EmptyString_Values()
        {
            string[] inputValue = {"", "12.5"};
            var returnValue = Add(inputValue);

            Assert.Equal(returnValue, 12.5m);
        }

        [Fact]
        public void TestSubtract_One_Value()
        {
            string[] inputValue = {"12.5"};
            var returnValue = Subtract(inputValue);

            Assert.Equal(returnValue, 12.5m);
        }

        [Fact]
        public void TestSubtract_Three_Values()
        {
            string[] inputValue = {"12.5","12.5","12.5"};
            var returnValue = Subtract(inputValue);

            Assert.Equal(returnValue, -12.5m);
        }

        [Fact]
        public void TestSubtract_EmptyString_Values()
        {
            string[] inputValue = {"", "12.5"};
            var returnValue = Subtract(inputValue);

            Assert.Equal(returnValue, 12.5m);
        }

        [Fact]
        public void TestMultiply_One_Value()
        {
            string[] inputValue = {"12.5"};
            var returnValue = Multiply(inputValue);

            Assert.Equal(returnValue, 12.5m);
        }

        [Fact]
        public void TestMultiply_Three_Values()
        {
            string[] inputValue = {"12.5","12.5","12.5"};
            var returnValue = Multiply(inputValue);

            Assert.Equal(returnValue, 1953.125m);
        }

        [Fact]
        public void TestMultiply_EmptyString_Values()
        {
            string[] inputValue = {"", "12.5"};
            var returnValue = Multiply(inputValue);

            Assert.Equal(returnValue, 12.5m);
        }

        [Fact]
        public void TestDivide_One_Value()
        {
            string[] inputValue = {"12.5"};
            var returnValue = Divide(inputValue);

            Assert.Equal(returnValue, 12.5m);
        }

        [Fact]
        public void TestDivide_Three_Values()
        {
            string[] inputValue = {"12.5","12.5","12.5"};
            var returnValue = Divide(inputValue);

            Assert.Equal(returnValue, 0.08m);
        }

        [Fact]
        public void TestDivide_EmptyString_Values()
        {
            string[] inputValue = {"", "12.5"};
            var returnValue = Divide(inputValue);

            Assert.Equal(returnValue, 12.5m);
        }

        [Fact]
        public void TestHighestFibonacciSequence()
        {
            string inputValue = "12";
            var returnValue = HighestFabonacciNumber(inputValue);

            Assert.Equal(returnValue, 8);
        }

        [Fact]
        public void TestHighestPrimeNumber()
        {
            string inputValue = "10";
            var returnValue = HighestPrimeNumber(inputValue);

            Assert.Equal(returnValue, 7);
        }

        [Fact]
        public void TestFactorial()
        {
            string inputValue = "5";
            var returnValue = Factorial(inputValue);

            Assert.Equal(returnValue, 120);
        }
    }
}
