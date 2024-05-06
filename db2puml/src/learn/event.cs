
namespace DB2PUML.Learn;

public class InfoPropagator
{
    public event Action<string> infoEvent;

    public void sendInfo(string info)
    {
        infoEvent.Invoke(info);
    }

    public void addSubscriber(InfoClient client)
    {
        infoEvent += client.clientMessage;
    }
}

public class InfoClient
{
    private string _clientName;

    public InfoClient(string clientName)
    {
        _clientName = clientName;
    }

    public void clientMessage(string propagatedInfo)
    {
        Console.WriteLine($"{_clientName}: got info from propagator, message: {propagatedInfo}");
    }

}
