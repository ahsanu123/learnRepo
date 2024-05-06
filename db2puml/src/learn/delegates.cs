
namespace DB2PUML.Learn;

public class NumberOp
{
    private double internalNumber;

    public delegate double delChangedouble(double number);

    public double changeNumber(double number, delChangedouble operation)
    {
        double operationResult = operation(number);

        return operationResult;
    }

    public double changeNumberFunc(double number, Func<double, double> operation)
    {

        double operationResult = operation(number);

        return operationResult;
    }

}
