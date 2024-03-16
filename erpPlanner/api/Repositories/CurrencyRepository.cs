using System.Xml;
using System.Data;
using Dapper;
using Dapper.Postgres;

using erpPlanner.Model;
using Newtonsoft.Json;

namespace erpPlanner.Repository;

public interface ICurrencyRepository
{
    public Task<string> GetRawCurrency();
}

public class CurrencyRepostory : ICurrencyRepository
{
    public async Task<string> GetRawCurrency()
    {
        string url = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
        var xmlDoc = new XmlDocument();
        xmlDoc.Load(url);

        var convertedJson = JsonConvert.SerializeXmlNode(xmlDoc);
        return convertedJson;

    }
}
