using erpPlanner.Model;
using Renci.SshNet;

namespace erpPlanner.Services;

public class FileUtilService
{
    private readonly IConfiguration _configuration;
    private readonly Sftp _sftpConfig;

    public FileUtilService(IConfiguration configuration)
    {
        _configuration = configuration;
        _sftpConfig = _configuration.GetSection("Sftp").Get<Sftp>();
    }

    public async Task<string> UploadImage(IFormFile image)
    {
        var filename = $"{Guid.NewGuid()}-{image.FileName}".Replace(" ", "_");
        using (var client = new SftpClient(_sftpConfig.Host, _sftpConfig.User, _sftpConfig.Pass))
        {
            client.Connect();
            var directoryExists = client.Exists(
                Path.Combine(_sftpConfig.BasePath, _sftpConfig.ImagePath)
            );
            if (!directoryExists)
            {
                client.CreateDirectory(Path.Combine(_sftpConfig.BasePath, _sftpConfig.ImagePath));
            }
            using (var imageStream = new MemoryStream())
            {
                await image.CopyToAsync(imageStream);
                client.UploadFile(
                    imageStream,
                    Path.Combine(_sftpConfig.BasePath, _sftpConfig.ImagePath, filename)
                );
            }
        }
        return filename;
    }

    public async Task<string> UploadResourceDocument(IFormFile file)
    {
        var filename = $"{Guid.NewGuid()}-{file.FileName}".Replace(" ", "_");
        using (var client = new SftpClient(_sftpConfig.Host, _sftpConfig.User, _sftpConfig.Pass))
        {
            client.Connect();
            var directoryExists = client.Exists(
                Path.Combine(_sftpConfig.BasePath, _sftpConfig.ResourceDocsPath)
            );
            if (!directoryExists)
            {
                client.CreateDirectory(
                    Path.Combine(_sftpConfig.BasePath, _sftpConfig.ResourceDocsPath)
                );
            }
            using (var fileStream = new MemoryStream())
            {
                await file.CopyToAsync(fileStream);
                client.UploadFile(
                    fileStream,
                    Path.Combine(_sftpConfig.BasePath, _sftpConfig.ResourceDocsPath, filename)
                );
            }
        }
        return filename;
    }
}
