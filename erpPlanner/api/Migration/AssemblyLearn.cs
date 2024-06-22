
namespace erpPlanner.assem;
[System.AttributeUsage(System.AttributeTargets.Class |
                       System.AttributeTargets.Struct,
                       AllowMultiple = true)  // Multiuse attribute.
]
public class AuthorAttribute : System.Attribute
{
    string Name;
    public double Version;

    public AuthorAttribute(string name)
    {
        Name = name;

        // Default value.
        Version = 1.0;
    }

    public string GetName() => Name;
}

public abstract class BaseAssem
{
    public abstract string hello();
}

[AuthorAttribute("helli")]
public class InheritBase : BaseAssem
{
    public override string hello()
    {
        return "Inherit Hello";
    }

}

public class Hoho : BaseAssem
{
    public override string hello()
    {
        return "Hoho Hello";
    }

}
public class hihi : BaseAssem
{
    public override string hello()
    {
        return "HIHI hello";
    }
}
