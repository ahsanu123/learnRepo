namespace erpPlanner.Model;


public class Currency
{
    public string time { get; set; }
    public CurrencyItem[] Cube { get; set; }

}

public class CurrencyItem
{
    public string currency { get; set; }
    public float rate { get; set; }
}
