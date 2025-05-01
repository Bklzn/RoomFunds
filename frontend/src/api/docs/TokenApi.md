# TokenApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**tokenCreate**](#tokencreate) | **POST** /token | |
|[**tokenRefreshCreate**](#tokenrefreshcreate) | **POST** /token/refresh | |

# **tokenCreate**
> TokenObtainPair tokenCreate(tokenObtainPair)

Takes a set of user credentials and returns an access and refresh JSON web token pair to prove the authentication of those credentials.

### Example

```typescript
import {
    TokenApi,
    Configuration,
    TokenObtainPair
} from './api';

const configuration = new Configuration();
const apiInstance = new TokenApi(configuration);

let tokenObtainPair: TokenObtainPair; //

const { status, data } = await apiInstance.tokenCreate(
    tokenObtainPair
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tokenObtainPair** | **TokenObtainPair**|  | |


### Return type

**TokenObtainPair**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tokenRefreshCreate**
> TokenRefresh tokenRefreshCreate(tokenRefresh)

Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.

### Example

```typescript
import {
    TokenApi,
    Configuration,
    TokenRefresh
} from './api';

const configuration = new Configuration();
const apiInstance = new TokenApi(configuration);

let tokenRefresh: TokenRefresh; //

const { status, data } = await apiInstance.tokenRefreshCreate(
    tokenRefresh
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tokenRefresh** | **TokenRefresh**|  | |


### Return type

**TokenRefresh**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

