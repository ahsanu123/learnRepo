using System.Text;
using erpPlanner.Model;
using erpPlanner.Repository;
using erpPlanner.Services;
using Microsoft.AspNetCore.Mvc;
using Renci.SshNet;

namespace erpPlanner.Controllers;

[ApiController]
[Route("File/")]
public class FileController : Controller
{
    private IConfiguration _configuration;
    private readonly Sftp _sftpConfig;
    private FileUtilService _fileUtil;

    public FileController(IConfiguration configuration, FileUtilService fileUtil)
    {
        _configuration = configuration;
        _fileUtil = fileUtil;
        _sftpConfig = _configuration.GetSection("Sftp").Get<Sftp>();
    }

    [HttpPost]
    [Route("resource")]
    public async Task<ActionResult> UploadResource(IFormFile res)
    {
        var filename = await _fileUtil.UploadResourceDocument(res);
        return Ok(filename);
    }

    [HttpPost]
    [Route("image")]
    public async Task<ActionResult> UploadImage(IFormFile image)
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
        return Ok(filename);
    }
}
