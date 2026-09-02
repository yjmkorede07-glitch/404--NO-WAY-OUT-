#if UNITY_EDITOR
using NUnit.Framework;
using NoWayOut.Addressables;
using NoWayOut.Backend;

namespace NoWayOut.EditorTests
{
    public class PreEditorContractTests
    {
        [Test] public void AddressRegistryHasCoreGroups() => Assert.GreaterOrEqual(ContentAddressRegistry.All.Count, 10);
        [Test] public void BackendContractIsVersioned() => Assert.AreEqual(1, BackendServiceContract.ContractVersion);
        [Test] public void BackendRoutesAreAbsolute() => Assert.IsTrue(BackendServiceContract.Auth.StartsWith("/v1/"));
    }
}
#endif
