
namespace DB2PUML.Learn;

public static class Learn
{

    public static void executeDelegates()
    {
        double number = 12.21;

        var numberOperator = new NumberOp();
        var resultNumber = numberOperator.changeNumber(number, (number) =>
        {
            return number * 2;
        });

        var resultNumberFunc = numberOperator.changeNumberFunc(number, (number) =>
        {
            return number * 2.5;
        });

        Console.WriteLine($"numberOperator: {resultNumber}");
        Console.WriteLine($"numberOperatorFunc: {resultNumberFunc}");

    }

    public static void executeEvent()
    {
        InfoPropagator propagator = new InfoPropagator();

        InfoClient client1 = new InfoClient("client1");
        InfoClient client2 = new InfoClient("client2");

        propagator.addSubscriber(client1);
        propagator.addSubscriber(client2);

        propagator.sendInfo("this is somethink usefull information");
    }
}
