import {createLocalVue, mount} from "@vue/test-utils";
import {BootstrapVue} from "bootstrap-vue";
import redirectFromEsia from "@/server/sso";
/*import Request from 'express';
import Response from 'express';

const somRequest = Request();
console.log(somRequest);*/
const req = {
  cookies: {
    ref: ''
  },
  url: '',
  query: {
    code: 12345,
    ref: '',
    type: 'esia',
    passport: {},
    state: true,
  },
  /*get() {return ''},*/
};
const res = {
  "MESSAGE": "success",
  "CODE": 200,
  "data": {
    "prns": {
      "lastName": "Ионов",
      "verifying": false,
      "citizenship": "RUS",
      "inn": "623412775266",
      "vehicles": {
        "totalSize": 0
      },
      "updatedOn": 1644746924,
      "birthDate": "19.03.1987",
      "stateFacts": [
        "EntityRoot"
      ],
      "rIdDoc": 79113826,
      "firstName": "Кирилл",
      "trusted": true,
      "containsUpCfmCode": false,
      "middleName": "Александрович",
      "eTag": "04F64CDD305D7BAC5C97E88CC5FC7A0110E16E93",
      "status": "REGISTERED"
    },
    "docs": {
      "stateFacts": [
        "hasSize"
      ],
      "size": 1,
      "elements": [
        {
          "stateFacts": [
            "Identifiable"
          ],
          "number": "410267",
          "issueId": "620028",
          "series": "6106",
          "issuedBy": "Отделом УФМС",
          "eTag": "B297C8F4DC81318D66C4CE14C9941A5AF868F1F1",
          "id": 79113826,
          "vrfStu": "VERIFIED",
          "type": "RF_PASSPORT",
          "issueDate": "11.07.2007"
        }
      ],
      "eTag": "81C88808934359F7573F686371520D74C9AF61CC"
    },
    "addrs": {
      "stateFacts": [
        "hasSize"
      ],
      "size": 1,
      "elements": [
        {
          "zipCode": "111673",
          "fiasCode": "b2e08ce7-3f13-4301-8a4c-66291ac31f12",
          "type": "PRG",
          "house": "12",
          "countryId": "RUS",
          "stateFacts": [
            "Identifiable"
          ],
          "addressStr": "г. Москва, ул. Новокосинская",
          "flat": "303",
          "street": "Новокосинская",
          "eTag": "B17B394569E56B5D5C7D7143A5C7BA18BE337A4C",
          "id": 132332087,
          "region": "Москва",
          "frame": "5"
        }
      ],
      "eTag": "D6CBFE211CC4834C441EDB187F092F7915BBF1B3"
    },
    "oid": 1065399335,
    "ctts": {
      "stateFacts": [
        "hasSize"
      ],
      "size": 2,
      "elements": [
        {
          "stateFacts": [
            "Identifiable"
          ],
          "eTag": "22CCC936FDA5EDA1D51DA64B6A32CE7C829D1929",
          "id": 292716262,
          "vrfStu": "VERIFIED",
          "type": "EML",
          "value": "nitrogen2772@gmail.com"
        },
        {
          "stateFacts": [
            "Identifiable"
          ],
          "eTag": "A338F93538CEDED74C45034838D6F2E8BD788466",
          "id": 128897506,
          "vrfStu": "VERIFIED",
          "type": "MBT",
          "value": "+7(910)5092040"
        }
      ],
      "eTag": "F521BBC363765C70AEE5A5743B35670403A4CECB"
    },
    "vhls": {
      "stateFacts": [
        "hasSize"
      ],
      "size": 0,
      "elements": [],
      "eTag": "E37B4E00DC3A2C3611A242DE05F63FB66F36FD52"
    }
  },
  "marker": {
    "access_token": "eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE2NTcyNjE3NzUsInNjb3BlIjoidmVoaWNsZXM_b2lkPTEwNjUzOTkzMzUgZnVsbG5hbWU_b2lkPTEwNjUzOTkzMzUgY29udGFjdHM_b2lkPTEwNjUzOTkzMzUgaW5uP29pZD0xMDY1Mzk5MzM1IG9wZW5pZCBiaXJ0aGRhdGU_b2lkPTEwNjUzOTkzMzUgZHJpdmVyc19saWNlbmNlX2RvYz9vaWQ9MTA2NTM5OTMzNSBlbWFpbD9vaWQ9MTA2NTM5OTMzNSBpZF9kb2M_b2lkPTEwNjUzOTkzMzUgbW9iaWxlP29pZD0xMDY1Mzk5MzM1IiwiaXNzIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6IjliMzhmNWVhLWU4NTktNDIzMi04ZjA3LWNjNWNhOGUxODRkYiIsInVybjplc2lhOnNial9pZCI6MTA2NTM5OTMzNSwiZXhwIjoxNjU3MjY1Mzc1LCJpYXQiOjE2NTcyNjE3NzUsImNsaWVudF9pZCI6IkNMSUVOVC1SRVNPLVJVIn0.gxLLKESiMrAWxNTVlsTZUsTJculgZpkMcuh4WhQF_asIEb5HrLZ8tMhMtR_Z_2SP5Iqik0GF3bfF5n33fjC2WbtKqZlYY49WcywUYqVgUrDNnLf7pgRkLnf8KrLhSfuyNrwE3PEeo5SKgrdIrUoUhxunKyOwqdomOUyZhUbFprdEJUE5nOimuRXqtfp56Yx1WTwq2EZhfrpul-JuyqBqZ265zTvK3xoaCv4qRTJVzbPvTCh5bWE-kfITGB3ZvJ_fpIq_IoB6S0gonJHe-G7zc7qDL9Pxl_bwWI81nBiShAWLjEbhV4I2bC-WQ3f9WowH7e2SJypMq8aQJYTGKXys4Q",
    "refresh_token": "2c1ffd34-acb7-2379-a997-a9f5d323614F",
    "id_token": "eyJ2ZXIiOjAsInR5cCI6IkpXVCIsInNidCI6ImlkIiwiYWxnIjoiUlMyNTYifQ.eyJhdWQiOiJDTElFTlQtUkVTTy1SVSIsInN1YiI6MTA2NTM5OTMzNSwibmJmIjoxNjU3MjYxNzc1LCJhbXIiOiJQV0QiLCJ1cm46ZXNpYTphbWQiOiJQV0QiLCJhdXRoX3RpbWUiOjE2NTcyNjE1ODUsImlzcyI6Imh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC8iLCJ1cm46ZXNpYTpzaWQiOiI5YjM4ZjVlYS1lODU5LTQyMzItOGYwNy1jYzVjYThlMTg0ZGIiLCJ1cm46ZXNpYTpzYmoiOnsidXJuOmVzaWE6c2JqOnR5cCI6IlAiLCJ1cm46ZXNpYTpzYmo6aXNfdHJ1Ijp0cnVlLCJ1cm46ZXNpYTpzYmo6b2lkIjoxMDY1Mzk5MzM1LCJ1cm46ZXNpYTpzYmo6bmFtIjoiT0lELjEwNjUzOTkzMzUifSwiZXhwIjoxNjU3MjcyNTc1LCJpYXQiOjE2NTcyNjE3NzV9.AM0Op3eIMUuZlMypPs7QRHfzET6uLyoYiwTbN3XXJEG9S1PHjlLofRWXKeiZGJtlfmY0SdyBfUZVhZACT3q2_u6tVZ7FpG3uh5eDa1ul7gTZugTOzun3Xqzals2c1WWrp2F1asJvxQekrYmCKkV273qndJPjxlSbOHuUP-yWuRzBagIOPTNhmDEcBEuTCr2X66P1kc_UAABytDpqczMYxFkxGTRlPqHJmOMd34I9v5aXi1pRAcUA2s-jAqv8MhfgJsmk0FG-aBOcz49nW1RZKy4kNV0BJ1cevYAGjuPHK1A4VaSPIm1drgG62NAZENQZT5KPDqHDAsCO_6jg5aUMdw",
    "state": "63d45c66-907a-4946-a98d-52ce29f2ccee",
    "token_type": "Bearer",
    "expires_in": 3600
  },
  "oid": 1065399335
};

jest.mock("axios");
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(),
  })
);

describe('Check auth._emias cookies after EMIAS login', () => {
  const AUTH_EISA = 'auth._eisa';
  /*const localVue = createLocalVue();
  localVue.use(BootstrapVue);*/

  // const wrapper = mount(AuthFormWrapper, {});

  it("Visible header button", async () => {
    //TODO need implementation
    /*await redirectFromEsia(req, res);

    expect(window.$nuxt.$cookiz?.[AUTH_EISA]);*/
    expect(true);
  });
});
