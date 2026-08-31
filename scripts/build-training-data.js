const fs = require('fs');
const path = require('path');

// Complete lines from the 15-page PDF OCR
const pagesRaw = [
// Page 1 (1-46)
`1 1992 Oktober 14 Jakarta Putera Group | Owner, BOD, Manager | Training | 
2 1992 November 10 Cibinong PT Tri Graha Sealisindo | Owner, BOD, Manager | Training | 
3 1993 Januari 12 Gresik PT Petrokimia Kayaku | Manager | Training | 
4 1993 Januari 13 Gresik PT Petrokimia Kayaku | Supervisor | Training | 
5 1993 Februari 11 Jakarta Manpower Department | AMT Facilitator | Training | 
6 1993 Februari 18 Gresik PT Petrokimia Kayaku | Supervisor | Training | 
7 1993 Februari 19 Gresik PT Petrokimia Kayaku | Dharma Wanita | Training | 
8 1993 Mei 20 Bogor Panin Bank, Bogor Branch | Supervisor | Training | 
9 1993 Juli 6 Bogor PT Tranka Kabel | Supervisor | Training | 
10 1993 Oktober 16 Jakarta PT Mustika Ratu | Manager | Training | 
11 1993 November 20 Bogor HRD Club | HRD Managers | Training | 
12 1994 April 15 Jakarta PT Bimantara Siti Wisesa | Manager | Training | 
13 1994 September 3 Jakarta PT Tancho Indonesia | Manager | Training | 
14 1994 Oktober 1 Jakarta PT Tancho Indonesia | Manager | Training | 
15 1994 Oktober 8 Cibinong PT Semen Cibinong | Manager | Training | 
16 1994 Oktober 15 Jakarta PT Federal Motor | Manager | Training | 
17 1994 Oktober 19 Jakarta Asosiasi Pabrik Kabel | HRD Managers | Training | 
18 1994 Oktober 22 Jakarta PT Tancho Indonesia | Supervisor | Training | 
19 1994 Oktober 26 Jakarta PT Asuransi Tri Pakarta | Manager | Training | 
20 1994 November 8 Tangerang PT Surya Toto Indonesia | Manager | Training | 
21 1994 November 12 Jakarta PT Tancho Indonesia | Supervisor | Training | 
22 1994 Desember 3 Jakarta PT Tancho Indonesia | Supervisor | Training | 
23 1994 Desember 23&24 Tangerang PT Surya Toto Indonesia | Supervisor | Training | 
24 1995 Januari 6&7 Tangerang PT Surya Toto Indonesia | Supervisor | Training | 
25 1995 Februari 11&12 Tangerang PT Surya Toto Indonesia | Supervisor | Training | 
26 1995 Februari 25 Bandung PT Ateja Tritunggal Corp | Manager | Training | 
27 1995 Maret 25 Jakarta PT Lippo Melco Electric | Manager | Training | 
28 1995 April 3&4 Jakarta PT Telkom, JakBar | Supervisor | Training | 
29 1995 April 8 Jakarta PT Lippo Melco Electric | Manager | Training | 
30 1995 April 22 Tangerang PT Surya Toto Indonesia | Supervisor | Training | 
31 1995 April 29 Bekasi PT Nasio Delta Electric | Supervisor | Training | 
32 1995 Mei 20&27 Jakarta PT Honda Federal | Manager | Training | 
33 1995 Juni 17&24 Jakarta PT Honda Federal | Supervisor | Training | 
34 1995 Juli 22 Bandung PT Ateja | Manager | Follow up | 
35 1995 September 15 Tangerang PT Surya Toto Indonesia | Manager | Follow up | 
36 1995 September 26 Jakarta PT Asuransi Tri Pakarta | Manager | Training | 
37 1995 Oktober 21 Tangerang PT Dynaplast | Supervisor | Training | 
38 1995 Oktober 28 Tangerang PT Dynaplast | Supervisor | Training | 
39 1995 Oktober 29 Jakarta Vihara Mahavira Graha | Youth of Buddhist | Training | 
40 1995 November 4 Bekasi PT Nasio Dutamitra Electric | Supervisor | Training | 
41 1995 November 7&8 Jakarta AN Teve | Operator | Training | 
42 1995 November 11&12 Bandung PT Surya Jaya Bhakti | Manager | Training | 
43 1995 Desember 16&23 Tangerang PT Dynaplast | Supervisor | Training | 
44 1996 Januari 18 Jakarta PT Asuransi Bintang | Manager | Training | 
45 1996 Maret 25 Jakarta IMKI (Institut Manajemen Keuangan Indonesia) | Sekretaris | Training | 
46 1996 April 12&13 Sukabumi PT Anwar Sierad | Manager | Training | `,

// Page 2 (47-95)
`47 1996 April 19&20 Tangerang PT Surya Toto Indonesia | Supervisor | Training | 
48 1996 April 26&27 Cisarua PT Anwar Sierad | Supervisor | Training | 
49 1996 Mei 2,3&4 Jakarta PT Alumindo Perkasa | Manager | Training | 
50 1996 Mei 7 Jakarta IMKI (Institut Manajemen Keuangan Indonesia) | Sekretaris | Training | 
51 1996 Mei 17&18 Tangerang PT Surya Toto Indonesia | Supervisor | Training | 
52 1996 Juni 1 Jakarta PT Alumindo Perkasa | Manager | Follow up | 
53 1996 Juni 6,7&8 Jakarta PT Alumindo Perkasa | Supervisor | Training | 
54 1996 Juni 13 Jakarta PT Alumindo Perkasa | Supervisor | Follow up | 
55 1996 Juni 28&29 Tangerang PT Surya Toto Indonesia | Supervisor | Training | 
56 1996 Juli-Agustus 29&1 Cibinong PT Semen Cibinong | Supervisor | Training | 
57 1996 Agustus 2&3 Tangerang PT Surya Toto Indonesia | Supervisor | Training | 
58 1996 Agustus 23 Cibinong PT Semen Cibinong | Supervisor | Follow up | 
59 1996 September 27&28 Cibinong PT Semen Cibinong | Supervisor | Training | 
60 1996 Oktober 5 Semarang PT Phapros | Manager | Training | 
61 1996 Oktober 14-17 Jakarta PT Igar jaya | Manager | Training | 
62 1996 Oktober 18&19 Bandung PT Surya Jaya Bhakti | Supervisor | Training | 
63 1996 Oktober 25 Cibinong PT Semen Cibinong | Supervisor | Follow up | 
64 1996 November 2&3 Anyer PT Bank DBS Buana Tat Lee | Supervisor | Training | 
65 1996 November 6 Jakarta PT Rajawali Nusantara Indonesia | Manager | Training | 
66 1996 November 8 Surabaya PT Rajawali Nusantara Indonesia | Manager | Training | 
67 1996 November 22&23 Cibinong PT Semen Cibinong | Supervisor | Training | 
68 1996 Desember 8 Sukabumi PT Kageo | Supervisor | Training | 
69 1996 Desember 20 Cibinong PT Semen Cibinong | Supervisor | Follow up | 
70 1997 Januari 11&18 Jakarta PT Cipta Saksama Indonesia | Manager | Training | 
71 1997 Mei 3&4 Jakarta PT Alpha Sarana | Manager | Training | 
72 1997 Juni 16,18,19,20 Jakarta PT Alpha Sarana | Supervisor | Training | 
73 1997 Agustus 19 Jakarta PT Rajawali Nusantara Indonesia | Manager | Training | 
74 1997 Agustus 26 Surabaya PT Rajawali Nusantara Indonesia | Manager | Training | 
75 1997 September 13 Yogyakarta PPG Madu Baru | Manager | Training | 
76 1997 September 19-20 Sukabumi PT Berca Hardaya Perkasa | Supervisor | Training | 
77 1997 Oktober 4&5 Lampung PT Budi Acid Jaya | Manager | Training | 
78 1997 Oktober 27&28 Jakarta Indomarco Group | Manager | Training | 
79 1997 November 25 Jakarta PT Honda Federal | Supervisor | Training | 
80 1997 November 27 Jakarta PT Berca Hardaya Perkasa | Supervisor | Training | 
81 1997 Desember 2 Jakarta PT Honda Federal | Supervisor | Training | 
82 1997 Desember 5&6 Jakarta Wiratman & Associates | Manager | Training | 
83 1997 Desember 9 Jakarta PT Honda Federal | Supervisor | Training | 
84 1997 Desember 12 Surabaya PT Panamas | Manager | Training | 
85 1998 Maret 13&14 Yogyakarta Atma Jaya University | Manager | Training | 
86 1998 April 20-23 Bogor PT Coats Rejo Indonesia | Manager | Training | 
87 1998 Mei 4,5,6,7 Bogor PT Coats Rejo Indonesia | Supervisor | Training | 
88 1998 Mei 25-26 Bogor PT Coats Rejo Indonesia | Supervisor | Training | 
89 1998 Juni 5 Jakarta Lions Club | Entrepreneur | Training | 
90 1998 Juni 6 Bogor PT Sierad Produce | Supervisor | Training | 
91 1998 Juni 8&9 Bogor PT Coats Rejo Indonesia | Supervisor | Training | 
92 1998 Juni 23 Sukabumi PT Aiwa Indonesia | Operator | Training | 
93 1998 Juli 7 Sukabumi PT Aiwa Indonesia | Operator | Training | 
94 1998 Juli 13 Sukabumi PT Aiwa Indonesia | Operator | Training | 
95 1998 Juli 16 Sukabumi PT Aiwa Indonesia | Operator | Training | `,

// Page 3 (96-143)
`96 1998 Juli 23 Jakarta PT Telkom, Jakbar | Supervisor | Training | 
97 1998 Juli 24 Jakarta PT Telkom, Jakbar | Supervisor | Training | 
98 1998 Agustus 3 Tangerang PT Surya Toto Indonesia | Supervisor | Training | 
99 1998 Agustus 5&6 Jakarta PT Kondur Petroleum | Manager | Training | 
100 1998 Agustus 11&12 Jakarta PT Kondur Petroleum | Manager | Training | 
101 1998 September 3 Jakarta PT Kondur Petroleum | Manager | Follow up | 
102 1998 September 9 Jakarta PT Kondur Petroleum | Manager | Follow up | 
103 1998 September 21&22 Jakarta PT Kondur Petroleum | Manager | Training | 
104 1998 September 24&25 Jakarta PT Kondur Petroleum | Manager | Training | 
105 1998 Oktober 26 Jakarta PT Kondur Petroleum | Manager | Follow up | 
106 1998 Oktober 27 Jakarta PT Kondur Petroleum | Manager | Follow up | 
107 1999 Mei 22&23 Sukabumi PT Anwar Sierad | Manager | Training | 
108 1999 Mei 29&30 Sukabumi PT Anwar Sierad | Supervisor | Training | 
109 1999 Juni 8 Sukabumi PT Aiwa Indonesia | Security | Training | 
110 1999 Juni 9 Jakarta SMU 31 | Teachers | Training | Biaya Sukarela
111 1999 Juni 16&17 Jakarta PT Otsuka Indonesia | Manager | Training | 
112 1999 Juni 23&24 Jakarta PT Otsuka Indonesia | Manager | Training | 
113 1999 Juli 9&10 Jakarta PT Intermas Tata Trading Co | Manager | Training | 
114 1999 Juli 16&17 Jakarta PT Otsuka Indonesia | Director & Senior Mgr. | Training | 
115 1999 Juli 23&24 Jakarta PT Otsuka Indonesia | Supervisor | Training | 
116 1999 Juli 30&31 Jakarta PT Otsuka Indonesia | Supervisor | Training | 
117 1999 Agustus 11&12 Cibitung PT Indofarma | Manager | Training | 
118 1999 Agustus 19&20 Cibitung PT Indofarma | Manager | Training | 
119 1999 Agustus 23&24 Cibitung PT Indofarma | Manager | Training | 
120 1999 Agustus 27&28 Jakarta PT Dexa medica | Manager | Training | 
121 1999 Agustus 30&31 Cibitung PT Indofarma | Supervisor | Training | 
122 1999 September 6&7 Cibitung PT Indofarma | Supervisor | Training | 
123 1999 September 9&10 Cibitung PT Indofarma | Supervisor | Training | 
124 1999 Oktober 4&5 Bandung PT Biofarma | Supervisor | Training | 
125 1999 Oktober 7&8 Bandung PT Biofarma | Supervisor | Training | 
126 1999 Oktober 11&12 Palembang PT Semen Baturaja | Manager | Training | 
127 1999 Oktober 15 Jakarta PT Toyota Astra Motor | Manager | Seminar | 
128 1999 Oktober 18-20 Pasuruan PT Meiji Indonesia | Manager | Training | 
129 1999 Oktober 25&26 Bandung PT Biofarma | Supervisor | Training | 
130 1999 November 8&9 Bandung PT Biofarma | Kepala Bagian | Training | 
131 1999 November 11&12 Bandung PT Biofarma | Kepala Divisi | Training | 
132 1999 November 18&19 Pasuruan PT Meiji Indonesia | Manager | Follow up | 
133 1999 November 23 Jakarta PT Maskapai Asuransi Indonesia | Manager | Training | 
134 1999 November 26&27 Tangerang PT Non Ferindo Utama | Manager | Training | 
135 1999 November 27 Malang PT. Halim Sakti Pratama | Supervisor | Training | 
136 1999 Desember 6&7 Palembang PT. Semen Baturaja | Manager | Training | 
137 1999 Desember 10 Tangerang PT. Halim Samudra Interutama | Manager | Training | 
138 2000 Januari 17 Tangerang PT. Halim Samudra Interutama | Operator | Training | 
139 2000 Januari 24 Tangerang PT. Halim Samudra Interutama | Operator | Training | 
140 2000 Januari 26&27 Jakarta King Studio Foto Group | Supervisor | Training | 
141 2000 Januari 27-29 Ciloto PT. Sawindo Kencana | Supervisor | Training | 
142 2000 Januari 31 Tangerang PT. Halim Samudra Interutama | Operator | Training | 
143 2000 Februari 7 Tangerang PT. Halim Samudra Interutama | Operator | Training | `,

// Page 4 (144-192)
`144 2000 Februari 9 Jakarta PT. Telkom, JakPus | Supervisor | Training | 
145 2000 Februari 25-27 Jakarta PT. Jastrindo Dinamika | Supervisor | Training | 
146 2000 Februari 25 Jakarta Perkoni Depdikbud, Jakarta Timur | Paket B | Ceramah | Biaya Gratis
147 2000 Maret 1&2 Pasuruan PT. ESJAMAT | Operator | Training | 
148 2000 Maret 4 Pangkal Pinang PT. Sawindo Kencana | Supervisor | Training | 
149 2000 Maret 5 Pangkal Pinang PT. Sawindo Kencana | Supervisor | Training | 
150 2000 Maret 11&12 Medan PT. Industri Pembungkus Internasional | Manager | Training | 
151 2000 Maret 15 Surabaya Wismilak Group | Manager | Training | 
152 2000 Maret 18 Medan PT. Industri Pembungkus Internasional | Manager | Follow up | 
153 2000 Maret 21&22 Pasuruan PT. ESJAMAT | Operator | Training | 
154 2000 Maret 21&22 Jakarta PT. Fastrata Buana | Manager | Training | 
155 2000 Maret 24-26 Jakarta PT. Jastrindo Dinamika | Supervisor | Training | 
156 2000 Maret 28-29 Pasuruan PT. ESJAMAT | Operator | Training | 
157 2000 Maret 30-31 Pasuruan PT. ESJAMAT | Operator | Training | 
158 2000 April 7-8 Bali PT. Rajawali Nusindo | Supervisor | Training | 
159 2000 April 10-12 Jakarta PT. PLN (Persero) Dist. Jaya & Tangerang | Kepala Seksie | Training | 
160 2000 April 15 Jakarta PT. Sinar Plataco Group | Supervisor | Training | 
161 2000 April 28 Palembang PT. Pupuk Sriwidjaja | Direksi | Training | 
162 2000 Mei 12-13 Surabaya PT. Gelora Djaja (Wismilak Group) | Supervisor | Training | 
163 2000 Mei 27-28 Pasuruan PT. ESJAMAT | Operator | Training | 
164 2000 Juni 2 Puncak PT Bahana Artha Ventura | VCO | Training | 
165 2000 Juni 6-9 Jakarta PT. Martina Berto | Supervisor | Training | 
166 2000 Juni 19-22 Pasuruan PT Meiji Indonesia | Supervisor | Training | 
167 2000 Juni 15 Bogor PT Anwar Sierad | SPV & Manager | Training | 
168 2000 Juli 21-23 Weleri Koperasi Sedya Karya Utama | Pengurus Koperasi | Training | 
169 2000 Juli 29 Jakarta PT TNT International | Supervisor | Training | 
170 2000 Agustus 12-15 Jakarta PT Kageo | Supervisor & Operator | Training | 
171 2000 Agustus 18-20 Serang PT Indah Kiat Serang Mill | Kepala Seksie | Training | 
172 2000 September 2 Jakarta PT. Indovickers | Supervisor | Training | 
173 2000 September 7 Serang Masyarakat Kecamatan Kragilan | Masyarakat | Dialog | Biaya Gratis
174 2000 September 12 Jakarta PT. Dunkindo Lestari | Supervisor&Operator | Training | 
175 2000 September 13-14 Jakarta PT Gramedia Widiasarana Indonesia | Supervisor | Training | 
176 2000 September 16 Jakarta PT TNT International | Supervisor | Training | 
177 2000 September 20-23 Pasuruan PT Esjamat | Supervisor | Training | 
178 2000 September 30 Citeureup PT Sonoco | Supervisor | Training | 
179 2000 Oktober 7-8 Cipayung PT Avesta Continental Pack | Supervisor | Training | 
180 2000 Oktober 14-15 Jakarta PT Gawih Jaya (Wismilak Group) | Supervisor & Operator | Training | 
181 2000 Oktober 21-22 Jakarta PT Gawih Jaya (Wismilak Group) | Supervisor & Operator | Training | 
182 2000 Oktober 28-29 Bandung PT Gawih Jaya (Wismilak Group) | Supervisor & Operator | Training | 
183 2000 November 4-5 Yogyakarta PT Gawih Jaya (Wismilak Group) | Supervisor & Operator | Training | 
184 2000 November 8-9 Pasuruan PT Sorini Towa Berlian Corporation | Chief and above | Training | 
185 2000 November 11-12 Pasuruan PT Sorini Towa Berlian Corporation | Foreman | Training | 
186 2000 November 14-15 Pasuruan PT Sorini Towa Berlian Corporation | Foreman | Training | 
187 2000 November 17 Jakarta PT Bogasari Flour Mills | Foreman | Training | 
188 2000 November 18 Jakarta PT Bogasari Flour Mills | Foreman | Training | 
189 2000 November 19 Jakarta PT Bogasari Flour Mills | Foreman | Training | 
190 2000 November 20 Jakarta PT Bogasari Flour Mills | Foreman | Training | 
191 2000 November 21 Jakarta PT Bogasari Flour Mills | Foreman | Training | 
192 2000 November 24 Anyer PT Astra Graphia, Tbk. | Manager | Training | `,

// Page 5 (193-237)
`193 2000 November 26 Jakarta PT Bogasari Flour Mills | Foreman | Training | 
194 2000 Desember 18-19 Jakarta Dinas Tenaga Kerja DKI Jakarta | Pimp.Dinas TenaKer DKI | Training | 
195 2001 Januari 13-14 Pasuruan PT Sorini Towa Berlian Corporation | Operator | Training | 
196 2001 Januari 16-17 Pasuruan PT Sorini Towa Berlian Corporation | Operator | Training | 
197 2001 Januari 19-20 Pasuruan PT Sorini Towa Berlian Corporation | Operator | Training | 
198 2001 Januari 22-23 Pasuruan PT Sorini Towa Berlian Corporation | Operator | Training | 
199 2001 Januari 27 Jakarta PT Indovickers | Dirut,Manajer,Sup.visor,Opr. | Training | 
200 2001 Januari 30-31 Nusa Dua, Bali PT (Persero) Pengembangan Pariwisata Bali | Dirut s/d Kasie | Training | 
201 2001 Februari 1-2 Nusa Dua, Bali PT (Persero) Pengembangan Pariwisata Bali | Staf | Training | 
202 2001 Februari 5-6 Nusa Dua, Bali PT (Persero) Pengembangan Pariwisata Bali | Staf | Training | 
203 2001 Februari 8-9 Nusa Dua, Bali PT (Persero) Pengembangan Pariwisata Bali | Staf | Training | 
204 2001 Februari 12-13 Nusa Dua, Bali PT (Persero) Pengembangan Pariwisata Bali | Staf | Training | 
205 2001 Februari 3 Nusa Dua, Bali Forum Komunikasi Masyarakat Nusa Dua | Masyarakat | Dialog | Biaya Gratis
206 2001 Februari 7 Nusa Dua, Bali Forum Komunikasi Masyarakat Nusa Dua | Masyarakat | Dialog | Biaya Gratis
207 2001 Februari 17 Tangerang PT Culletprima Setia | Kepala Bagian | Training | 
208 2001 Februari 20 Jakarta PT Dunkindo Lestari | Supervisor | Training | 
209 2001 Februari 22 Surabaya PT Bogasari Flour Mills | Foreman | Training | 
210 2001 Februari 23 Surabaya PT Bogasari Flour Mills | Foreman | Training | 
211 2001 Maret 24-25 Bandung PT Dankos Laboratories | Supervisor | Training | 
212 2001 Maret 28-29 Jakarta PT Dian Graha Elektrika | Middle Manager | Training | 
213 2001 April 1 Jakarta PT Bogasari Flour Mills | Operator - Foremen | Training | 
214 2001 April 8 Jakarta PT Bogasari Flour Mills | Operator - Foremen | Training | 
215 2001 April 3-4 Tangerang PT Berlina, Tbk. | Operator / Supervisor | Training | 
216 2001 April 5-6 Tangerang PT Berlina, Tbk. | Operator / Supervisor | Training | 
217 2001 April 10-11 Tangerang PT Berlina, Tbk. | Operator / Supervisor | Training | 
218 2001 April 11-12 Palangkaraya PT Telkom Palangkaraya | Supervisor | Training | 
219 2001 April 17 Surabaya PT Ciputra Surya, Tbk. | Non Staf | Training | 
220 2001 April 18 Surabaya PT Ciputra Surya, Tbk. | Non Staf | Training | 
221 2001 April 21-22 Jakarta PT Golden Adishoes | Kep. regu, Mandor & Operator | Training | 
222 2001 April 26-27 Kudus PT Hartono Istana Teknologi (Polytron) | Manajer-Direktur | Training | 
223 2001 Mei 12-13 Jakarta PT Presisi Cimanggis Makmur | Kepala Seksie | Training | 
224 2001 Mei 19-20 Jakarta Kompak Group | Kabag-Supervisor | Training | 
225 2001 Mei 16-17 Jambi PT Dombamas Plantation | Manajer | Training | 
226 2001 Mei 22-23 Jakarta PT Gramedia | Supervisor | Training | 
227 2001 Mei 26-27 Kudus PT Hartono Istana Teknologi (Polytron) | Mandor-Asisten Supervisor | Training | 
228 2001 Mei 30-31 Jakarta PT Impack Pratama | Supervisor | Training | 
229 2001 Mei 31 Jakarta B. P. Gedung Manggala Wanabakti | Manajer-Direktur | Diskusi | 
230 2001 Juni 2-3 Jakarta PT Intisar Primula | Manajer-Direktur | Training | 
231 2001 Juni 2-3 Jakarta PT Jakarta Land | Operator | Training | 
232 2001 Juni 9-10 Jakarta PT Jakarta Land | Operator | Training | 
233 2001 Juni 9 Jakarta Kompak Group | Manajer | Training | 
234 2001 Juni 16-17 Jakarta PT Jakarta Land | Operator | Training | 
235 2001 Juni 16 Jakarta PT Intisar Primula | Supervisor | Training | 
236 2001 Juni 23 Jakarta Kompak Group | Direktur | Training | 
237 2001 Juni 30 Jakarta PT Intisar Primula | Supervisor | Training | `,

// Page 6 (238-285)
`238 2001 Juli 4 Jakarta PT Centranusa Insancemerlang (CNI) | Manajer | Training | 
239 2001 Juli 14-15 Jakarta PT Jakarta Land | Operator | Training | 
240 2001 Juli 14 & 21 Jakarta PT Asuransi Mitsui Marine Indonesia | Manajer | Training | 
241 2001 Juli 21-22 Jakarta PT Jakarta Land | Operator | Training | 
242 2001 Juli 24-25-26 Surabaya PT Tanindo Subur Prima | Manajer | Training | 
243 2001 Juli 28 Bangka PT Sawindo Kencana | Supervisor | Training | 
244 2001 Juli 28 Jakarta PT Jakarta Land | Anak-anak Putus Sekolah | Dialog | Biaya Gratis
245 2001 Agustus 4-5 Jakarta PT Jakarta Land | Operator | Training | 
246 2001 Agustus 8-9 Jakarta PT Gramedia | Supervisor | Training | 
247 2001 Agustus 15-16-17 Jakarta PT Alpharma | Supervisor | Training | 
248 2001 Agustus 21 Surabaya PT Ciputra Surya, Tbk. | Non Staf | Training | 
249 2001 Agustus 22 Surabaya PT Ciputra Surya, Tbk. | Non Staf | Training | 
250 2001 Agustus 24-25 Puncak PT Coates Indonesia | Supervisor | Training | 
251 2001 Agustus 28-29 Jakarta B. P. Gedung Manggala Wanabakti | Supervisor | Training | 
252 2001 September 6-7 Jakarta PT Centranusa Insancemerlang (CNI) | Supervisor | Training | 
253 2001 September 10-11 Jakarta PT Centranusa Insancemerlang (CNI) | Direksi | Training | 
254 2001 September 18-19 Jakarta PT Charoen Pokphand Indonesia | Supervisor-Manajer | Training | 
255 2001 September 28-29 Bandung PT Sanbe Farma | Manajer | Training | 
256 2001 September 30 Jakarta Perkoni Depdikbud, Jakarta Timur | Paket A, B, dan C | Ceramah | Biaya Gratis
257 2001 Oktober 7 Bandung PT Fastrata Buana | Supervisor-Staf | Training | 
258 2001 Oktober 10-11-12 Kediri PT BISI | Supervisor ke Bawah | Training | 
259 2001 Oktober 28 Bandung PT Fastrata Buana | Supervisor-Staf | Training | 
260 2001 Oktober 30-31 Palembang PT Percetakan Rambang | Supervisor | Training | 
261 2001 November 15 Bangka Koperasi Bina Tani Sejahtera | Petani Plasma | Training | 
262 2001 November 18 Bangka PT Sawindo Kencana | Karyawan Pabrik | Training | 
263 2002 Januari 5 & 12 Jakarta PT Jakarta Land | Staf | Training | 
264 2002 Januari 13-14-15 Jakarta PT Millennium Pharmacon International, Tbk. | Manajer | Training | 
265 2002 Januari 19 & 26 Jakarta PT Jakarta Land | Manajer | Training | 
266 2002 Januari 24-25 Jakarta PT Centranusa Insancemerlang (CNI) | Supervisor | Training | 
267 2002 Februari 1-2 Puncak PT Charoen Pokphand Indonesia | Manajer | Training | 
268 2002 Februari 7 Puncak PT Furindo Kencana | Supervisor | Training | 
269 2002 Februari 10-11-12 Depok PT Millennium Pharmacon International, Tbk. | Supervisor | Training | 
270 2002 Maret 2-3 Pelaihari PT Perkebunan Centramas Nusantara | Manajer-Supervisor | Training | 
271 2002 Maret 10 Surabaya PT Bogasari Flour Mills | Manajer-Supervisor | Ceramah | 
272 2002 Maret 17 Surabaya PT Bogasari Flour Mills | Manajer-Supervisor | Ceramah | 
273 2002 Maret 19 Jakarta PT Tiga Raksa Satria, Tbk. | Supervisor | Training | 
274 2002 Maret 21-22 Jakarta PT Gramedia | Supervisor | Training | 
275 2002 Maret 23-24 Puncak PT Fabindo Sejahtera | Supervisor | Training | 
276 2002 Maret 24 Surabaya PT Bogasari Flour Mills | Manajer-Supervisor | Ceramah | 
277 2002 Mei 1-2 Jakarta PT Gramedia | Supervisor | Training | 
278 2002 Juni 8 Puncak SMP Charitas | Siswa Kelas III | Dialog | Biaya Sukarela
279 2002 Juli 4 Anyer PT. L'Oreal Indonesia | Manajer | Training | 
280 2002 Agustus 9-10 Serang PT. Indah Kiat Pulp & Paper, Tbk | Supervisor | Training | 
281 2002 Agustus 24-25 Puncak PT. Tirta Marta | Supervisor | Training | 
282 2002 Agustus 30-31 Serang PT. Indah Kiat Pulp & Paper | Supervisor | Training | 
283 2002 September 4-5 Jakarta PT. Centranusa Insan Cemerlang | Supervisor | Training | 
284 2002 September 13-14 Serang PT. Indah Kiat Pulp & Paper | Supervisor | Training | 
285 2002 September 21-22 Puncak PT. Tirta Marta | Operator | Training | `,

// Page 7 (286-335)
`286 2002 September 24-25 Jakarta PT. Centranusa Insan Cemerlang | Supervisor | Training | 
287 2002 September 27 Serang PT. Indah Kiat Pulp & Paper | Pengemudi | Training | 
288 2002 September 28-29 Puncak PT. Tirta Marta | Operator | Training | 
289 2002 Oktober 8 Yogyakarta PT. Pratapa Nirmala (Fahrenheit) | Supervisor | Training | 
290 2002 Oktober 10-11 Serang PT. Indah Kiat Pulp & Paper | Supervisor | Training | 
291 2002 Oktober 12-13 Puncak PT. Tirta Marta | Operator | Training | 
292 2002 Oktober 19-20 Puncak PT. Tirta Marta | Operator | Training | 
293 2002 Oktober 26-27 Puncak PT. Tirta Marta | Operator | Training | 
294 2002 Oktober 23-24 Jakarta PT. Dwi Satria Utama | Supervisor | Training | 
295 2002 Oktober 29-30 Jakarta PT. Dwi Satria Utama | Supervisor | Training | 
296 2002 November 1-2 Jakarta PT. Dwi Satria Utama | Supervisor | Training | 
297 2002 Desember 15-16 Bandung PT. Kalbe Farma | Supervisor | Training | 
298 2003 Januari 20-21 Bandung PT. Kalbe Farma | Supervisor | Training | 
299 2003 Februari 10-11 Surakarta PT. Konimex | Supervisor | Training | 
300 2003 Februari 19-20 Jakarta PT. Contimas Utama Ind (Carrefour) | Manajer | Training | 
301 2003 Februari 22-23 Bekasi PT. Indoporlen | Supervisor | Training | 
302 2003 Maret 27 Jakarta Kamar Dagang dan Industri Indonesia | Umum, LSM dan Swasta | Forum Diskusi | 
303 2003 April 22 Jakarta Sekolah Menengah Umum Negeri 13 | Siswa Kelas I&II | Dialog Bersama Tokoh | Biaya Sukarela
304 2003 April 28 Jakarta Yayasan Bhakti POLRI Pusat | Purnawirawan POLRI | Semiloka | Biaya Sukarela
305 2003 Mei 27-28 Jakarta PT. Gramedia Percetakan | Supervisor | Training | 
306 2003 Juni 5-6 Semarang PT. Gramedia Percetakan | Supervisor | Training | 
307 2003 Juni 12-13 Puncak PT. Arpeni Pratama Ocean Line | Junior --> Senior Staf | Training | 
308 2003 Juni 21-22 Tangerang PT. Merpati Mahkota Sarana | Staf | Training | 
309 2003 Juni 24-25 Jakarta Konfrensi Wali Gereja Indonesia | Staf dan Kabag | Training | 
310 2003 Juli 24-25 Cipayung BAPEKODYA Jakarta Timur | Staf | Training | 
311 2003 Juli 26-27 Puncak Dian Graha Elektrika | Staf | Training | 
312 2003 Juli 31 Puncak PT. Arpeni Pratama Ocean Line | Junior --> Senior Staf | Training | 
313 2003 Agustus 1 Puncak PT. Arpeni Pratama Ocean Line | Junior --> Senior Staf | Training | 
314 2003 Agustus 7-8 Jakarta PT. Gramedia Percetakan | Supervisor | Training | 
315 2003 Agustus 13 Puncak Persatuan Mahasiswa Katholik RI cab.Bogor | Mahasiswa | Training | Biaya Sukarela
316 2003 Agustus 28-29 Puncak PT. Arpeni Pratama Ocean Line | Junior --> Senior Staf | Training | 
317 2003 September 12-13 Bogor PT. B-Funds | Staf --> Direksi | Training | 
318 2003 September 17 Puncak PT. Meprofarm | Staf --> Ka.Cabang | Training | 
319 2003 September 18-19 Puncak PT. Dankos Laboratories | Manajer --> Direksi | Training | 
320 2003 September 25-26 Puncak PT. Dankos Laboratories | Manajer --> Direksi | Training | 
321 2003 Oktober 1 Jakarta Perhimpunan Rumah Sakit Seluruh Ind | Peserta | Konggres | 
322 2003 Oktober 3-4 Jakarta PT. Maharupa Gatra | Supervisor --> Direksi | Training | 
323 2003 Oktober 6-7 Jakarta PT. Eka Boga Inti | Supervisor --> Direksi | Training | 
324 2003 Oktober 10-11 Jakarta PT. Maharupa Gatra | Staf-->Supervisor | Training | 
325 2003 Oktober 14-15 Jakarta PT. Eka Boga Inti | Supervisor | Training | 
326 2003 Oktober 17-18 Jakarta PT. Dian Graha Elektrika | Staf --> Supervisor | Training | 
327 2003 Oktober 21-22 Jakarta PT. Eka Boga Inti | Staf --> Supervisor | Training | 
328 2003 Oktober 28-29 Jakarta PT. Eka Boga Inti | Staf --> Supervisor | Training | 
329 2003 November 3-4 Medan N.V. Sumatra Tobacco Trading Company | As Man --> Direksi | Training | 
330 2003 November 6-7 Medan N.V. Sumatra Tobacco Trading Company | As Man --> Direksi | Training | 
331 2003 November 20-21 Jakarta PT. Kirin Griya Indotama | As Man --> Direksi | Training | 
332 2003 Desember 5-6 Jakarta PT. Maharupa Gatra | Staf --> Operator | Training | 
333 2003 Desember 10 Jakarta Keuskupan Agung Jakarta | Para Koster (Pelayan di Gereja) | Pembekalan | Tidak dipungut biaya
334 2003 Desember 12-13 Jakarta PT. Maharupa Gatra | Staf --> Operator | Training | 
335 2004 Januari 9-10 Jakarta PT. Maharupa Gatra | Staf --> Operator | Training | `,

// Page 8 (336-386)
`336 2004 Januari 16-17 Jakarta PT. Maharupa Gatra | Staf --> Operator | Training | 
337 2004 Januari 27 Jakarta PT. Takeda Indonesia | Manager s.d Staf | Training | 
338 2004 Februari 2 Yogyakarta Paroki/Gereja Katholik | Pengurus dan Umat | Training | Sukarela
339 2004 Februari 6-7 Jakarta PT. Maharupa Gatra | Staf --> Operator | Training | 
340 2004 Februari 9-10 Jakarta PT. Blue Gas | Staf --> Operator | Training | 
341 2004 Februari 13-14 Jakarta PT. Maharupa Gatra | Staf --> Operator | Training | 
342 2004 Februari 17-18 Lembang Toserba YOGYA | Staf -->Manager | Training | 
343 2004 Februari 20-21 Jakarta Majalah Hidup Katholik | Staf-->Pimpinan | Training | 
344 2004 Februari 24-25 Lembang Toserba YOGYA | Staf-->Manager | Training | 
345 2004 Februari 27-28 Jakarta PT. Kaji Inova Media | Staf-->Manager | Training | 
346 2004 Maret 6 Jakarta PT. Intisar Primula | Staf --> Manager | Training | 
347 2004 Maret 30-31 Bandung Toserba YOGYA | Staf-->Operator | Training | 
348 2004 April 3-4 Jakarta PT. Padma Soode | Staf-->Operator | Training | 
349 2004 April 17-18 Jakarta PT. Padma Soode | Staf-->Operator | Training | 
350 2004 April 24-25 Jakarta PT. Padma Soode | Staf-->Operator | Training | 
351 2004 Mei 8 Puncak PT. EXCO Nusantara | Staf-->Manager | Training | 
352 2004 Mei 15 Jakarta PT. Dian Graha Elektrika | Staf-->Manager | Training | 
353 2004 Juni 5 Puncak Kelompok Karyawan Muda Katholik | Anggota & Umat | Training | Suka Rela
354 2004 Juni 8-9 Lembang Toserba YOGYA | Supervisor | Training | 
355 2004 Juni 11-12 Jakarta Prijohandojo, Boentoro & Co | Staf-->Manager | Training | 
356 2004 Juni 14-15 Jakarta PT. Swadharma Primautama (Lymann Group) | Operator --> Supervisor | Training | 
357 2004 Juni 23-24 Lembang Toserba YOGYA | Supervisor | Training | 
358 2004 Juni 30 Lembang Toserba YOGYA | Supervisor | Training | 
359 2004 Juli 1 Lembang Toserba YOGYA | Supervisor | Training | 
360 2004 Juli 6-7 Citeureup PT. Indocement Tunggal Prakarsa | Operator --> Supervisor | Training | 
361 2004 Juli 9-10 Jakarta Prijohandojo, Boentoro & Co | Staff-->Supervisor | Training | 
362 2004 Juli 12-13 Citeureup PT. Indocement Tunggal Prakarsa | Staff-->Supervisor | Training | 
363 2004 Juli 19-20 Citeureup PT. Indocement Tunggal Prakarsa | Staff-->Supervisor | Training | 
364 2004 Juli 24-25 Mega Mendung PT. Unilever Indonesia, Tbk | Staf | Training | 
365 2004 Juli 26 Jakarta Kel. Karyawan Muda Katholik KAJ | Anggota | Training | 
366 2004 Juli 28-29 Mega Mendung PT. Unilever Indonesia, Tbk | Staf | Training | 
367 2004 Juli 30-31 Jakarta Prijohandojo, Boentoro & Co | Staf | Training | 
368 2004 Agustus 6-7 Jakarta Prijohandojo, Boentoro & Co | Staf | Training | 
369 2004 Oktober 13-14 Mega Mendung PT. Unilever Indonesia, Tbk | Staf | Training | 
370 2004 November 27 Jakarta PT. Bank Buana Indonesia | Staf | Training | 
371 2004 November 28 Jakarta PT. Bank Buana Indonesia | Staf | Training | 
372 2004 Desember 4 Jakarta PT. Bank Buana Indonesia | Staf | Training | 
373 2004 Desember 5 Jakarta PT. Bank Buana Indonesia | Staf | Training | 
374 2004 Desember 14 Cikarang PT. Unilever Indonesia, Tbk | Staf | Training | 
375 2004 Desember 30 Cikarang PT. Unilever Indonesia, Tbk | Staf | Training | 
376 2005 Januari 3 Jakarta PT. Sawindo Kencana | Staf | Training | 
377 2005 Januari 29-30 Ciloto PT. Riken Asahi Plastics Indonesia | Staf--Pelaksana | Training | 
378 2005 Februari 7-8 Ciloto PT. Riken Asahi Plastics Indonesia | Staf--Pelaksana | Training | 
379 2005 Februari 19-20 Ciloto PT. Riken Asahi Plastics Indonesia | Staf--Pelaksana | Training | 
380 2005 Februari 26-27 Ciloto PT. Riken Asahi Plastics Indonesia | Staf--Pelaksana | Training | 
381 2005 Maret 12-13 Ciloto PT Cometa Can | Manajer | Training | 
382 2005 Maret 20-21 Cibinong PT Indocement Tunggal Prakarsa | Operator | Training | 
383 2005 April 2-3 Cibubur PT Cometa Can | Supervisor | Training | 
384 2005 Mei 6 Cilodong Universitas Atmajaya Jakarta | Siswa SMA Jabala | LDK | Sukarela
385 2005 Juni 9 Jakarta Gabungan dari beberapa perusahaan | Eksekutif Perusahaan | Seminar 1 hari | 
386 2005 Juni 15 Kalimantan PT Alamraya Kencana Mas | Petani Plasma | Training | `,

// Page 9 (387-434)
`387 2005 Juni 17 Kalimantan PT Alamraya Kencana Mas | Petani Plasma | Training | 
388 2005 Juni 17 Jakarta Yayasan Pendidikan Tarakanita | Siswa-siswi kelas 2 SMU | Ceramah&Dialog | Sukarela
389 2005 Juli 12 Jakarta 4 Com | Eksekutif Perusahaan | Seminar Motivasi | 
390 2005 Juli 23 Jakarta KPPSM | Eksekutif Perusahaan | Seminar Hidup Sehat | 
391 2005 Agustus 5-6 Jakarta PT Indocement Tunggal Prakarsa | Eksekutif Perusahaan | Training | 
392 2005 Agustus 10 Jakarta PT Alpha Omega | Eksekutif Perusahaan | Training(2jam) | "BKrjaUnggul"
393 2005 Agustus 12-13 Jakarta PT Sinta Prima Feedmill | Eksekutif Perusahaan | Training | 
394 2005 September 27-28 Jakarta PT Garuda Metalindo | Eksekutif Perusahaan | Training | 
395 2005 Oktober 15-16 Jakarta PT Garuda Metalindo | Kasie, KaTekhik,Tekhnisi | Training | 
396 2005 Oktober 22-23 Jakarta PT Garuda Metalindo | Kasie, KaTekhik,Tekhnisi | Training | 
397 2005 November 10-11 Jakarta PT Garuda Metalindo | Kasie, KaTekhik,Tekhnisi | Training | 
398 2005 November 15-16 Jakarta PT Garuda Metalindo | Kasie, KaTekhik,Tekhnisi | Training | 
399 2005 November 22-23 Jakarta PT Garuda Metalindo | Kasie, KaTekhik,Tekhnisi | Training | 
400 2005 November 26-27 Jakarta PT Mega Pratama Ferindo | Kasie, KaTekhik,Tekhnisi | Training | 
401 2005 Desember 17-18 Jakarta PT Garuda Metal Utama | Eksekutif Perusahaan | Training | 
402 2005 Juni 25 Jakarta PT Erindo Mitra Sejahtera | Eksekutif Perusahaan | Training | 
403 2005 Desember 20-21 Jakarta PT Prodia | Ka.Cabang,Ka.Bidang,Ka.Seksi,Sekretaris | Training | 
404 2006 Januari 8,15 JABABEKA PT Smurfit Container Indonesia | Eksekutif Perusahaan | Training | 
405 2006 Januari 17-18 Ciganjur PT Pratesis | Eksekutif Perusahaan | Training | 
406 2006 Januari 19 Jababeka Mencegah&Menangani Demotivasi Karyawan Pasca kenaikn BBM | Eksekutif Perusahaan | Seminar 2 Jam | 
407 2006 Januari 22,29 JABABEKA PT Smurfit Container Indonesia | Eksekutif Perusahaan | Training | 
408 2006 Januari 24,25 Ciganjur PT Pratesis | Eksekutif Perusahaan | Training | 
409 2006 Pebruari 1&8 Citeureup PT Indocement Tunggal Prakarsa | Eksekutif Perusahaan | Training | 
410 2006 Pebruari 6-7 Jakarta PT Prodia | Eksekutif Perusahaan | Training | 
411 2006 Pebruari 17-18 Bogor PT Kaji Inova Media | Eksekutif Perusahaan | Training | 
412 2006 Maret 23 JABABEKA Seminar "Budaya Kerja Unggul sebagai Daya Saing Mutlak Industri Nasional" | Eksekutif Perusahaan | Seminar | 
413 2006 April 8-9 Puncak PT Sharp Semiconductor Indonesia | Eksekutif Perusahaan | Training | 
414 2006 April 27 Jababeka Seminar "Membangun Karakter Kuat Karyawan Indonesia…Mungkinkah?" | Eksekutif Perusahaan | Seminar | 
415 2006 Mei 9 Jakarta Seminar "Flu Burung" | Warga Paroki Cilangkap | Seminar | Gratis
416 2006 Mei 23 JABABEKA Seminar "Mencegah Unjuk Rasa di Perusahaan" | Eksekutif Perusahaan | Seminar | 
417 2006 Juni 3-4 MM2100 PT Daido Metal Indonesia | Eksekutif Perusahaan | Training | 
418 2006 Juni 6-7 Citeureup PT Indocement Tunggal Prakarsa | Eksekutif Perusahaan | Training | 
419 2006 Juni 17-18 MM2100 PT Daido Metal Indonesia | Eksekutif Perusahaan | Training | 
420 2006 Juni 29 KBN PT Medika Apparelindo | Eksekutif Perusahaan | In House Seminar | 
421 2006 Juli 1-2 MM2100 PT Daido Metal Indonesia | Eksekutif Perusahaan | Training | 
422 2006 Juli 4-5 Citeureup PT Indocement Tunggal Prakarsa | Eksekutif Perusahaan | Training | 
423 2006 Juli 15-16 MM2100 PT Daido Metal Indonesia | Eksekutif Perusahaan | Training | 
424 2006 Juli 27 JABABEKA Seminar "Mencegah Unjuk Rasa di Perusahaan" | Eksekutif Perusahaan | Seminar | 
425 2006 Agustus 5-6 MM2100 PT Daido Metal Indonesia | Eksekutif Perusahaan | Training | 
426 2006 Agustus 25-26 JABABEKA Seminar "Good People Governance as an Important Basic for Good Corporate Governance" | Eksekutif Perusahaan | Seminar | 
427 2006 September 18 JABABEKA Public Course "Positive Character Building" | Eksekutif Perusahaan | Seminar | 
428 2006 September 22 Tangerang PT Merpati Mahkota Sarana | Eksekutif Perusahaan | In House Seminar | 
429 2006 Oktober 5 JABABEKA PT BASF Construction Chemical | Eksekutif Perusahaan | Health Quotient | 
430 2006 Oktober 11-12 JABABEKA Seminar "Positive Character Building through Positive Mental Attitude Training" | Eksekutif Perusahaan | Seminar | 
431 2006 November 14-15 Citeureup PT Indocement Tunggal Prakarsa | Eksekutif Perusahaan | Training | 
432 2006 November 29 Jakarta PT Prodia | Eksekutif Perusahaan | Training | 
433 2006 Nov-Des 30-1 Papua PT Freeport-Yay.Pend.Jayawijaya | Para Guru&Karyawan | Training | 
434 2006 Desember 2 Jakarta PT Sahabat Jaya Sukses | Eksekutif Perusahaan | Training | `,

// Page 10 (435-481)
`435 2006 Desember 4-5 Papua PT Freeport-Yay.Pend.Jayawijaya | Para Guru&Karyawan | Training | 
436 2006 Desember 7-8 Papua PT Freeport-Yay.Pend.Jayawijaya | Para Guru&Karyawan | Training | 
437 2006 Desember 8 Jakarta PT Daido Metal Indonesia | Operator | BeTest | 
438 2006 Desember 11-12 Papua PT Freeport-Yay.Pend.Jayawijaya | Para Guru&Karyawan | Training | 
439 2007 Januari 11 Jakarta Unika Atmajaya-Jakarta | Mahasiswa | LKMM | Sukarela
440 2007 Januari 19 Jakarta PT Prodia Laboratorium | Eksekutif Perusahaan | Training | 
441 2007 Pebruari 27-28 Citeureup PT Indocement Tunggal Prakarsa | Ka.Regu, Pelaksana | Training | 
442 2007 Maret 22 Jakarta Kel.HRD Katholik "SUDARA" | Anggota | Training | 
443 2007 Maret 26-27 Citeureup PT Indocement Tunggal Prakarsa | Eks.Kary.Div Trans lev.5-6 | Training | 
444 2007 Maret 28-29 Citeureup PT Indocement Tunggal Prakarsa | Eks.Kary.Div Trans lev.5-6 | Training | 
445 2007 April 10-11 Rumbai-PKU Yay.Pend.Cendana-PT Chevron Indonesia | Guru & Karyawan | Training | 
446 2007 April 14 Jakarta PT White Dove Indonesia | Staf-semua tingkatan | Training | 
447 2007 Mei 12 Jakarta PT White Dove Indonesia | Staf - semua tingkatan | Training | 
448 2007 Juni 23 Jakarta PT White Dove Indonesia | Staf - semua tingkatan | Training | 
449 2007 Juli 16 Jakarta PT Bahana Utama Line | Staf-->Pres Dir | Training | 
450 2007 Juli 28 Lampung BeTest untuk Rekrutmen karyawan dari UNILA Oleh PT.Sawindo Kencana | Sarjana Pertanian | Behavior Test | 
451 2007 Agustus 10 Surakarta BeTest untuk Rekrutmen Karyawan dari UNS Oleh PT.Sawindo Kencana | Sarjana Pertanian, Ekonomi, Teknik Mesin | Behavior Test | 
452 2007 Agustus 12 Anyer-Banten CV. Matraco Komponen | Semua Tingkatan Staf | Training | 
453 2007 September 1 Malang BeTest untuk Rekrutmen Karyawan dari STPP Oleh PT.Sawindo Kencana | Sarjana Pertanian, Ekonomi | Behavior Test | 
454 2007 September 8 Bogor BeTest untuk Rekrutmen Karyawan dari STPP Oleh PT.Sawindo Kencana | Sarjana Pertanian, Ekonomi | Behavior Test | 
455 2007 September 15 Medan BeTest untuk Rekrutmen Karyawan dari USU Oleh PT.Sawindo Kencana | Sarjana Pertanian | Behavior Test | 
456 2007 Oktober 3 Bogor BeTest untuk Rekrutmen Karyawan dari STPP Oleh PT.Sawindo Kencana | Sarjana Pertanian | Behavior Test | 
457 2007 Oktober 6 Jakarta SLTA IPEKA | Siswa Kelas 2 & 3 | Seminar | Komunikasi
458 2007 Desember 1-2 Jakarta PT Ciptakomunindo Pradipta | Manager | Training | 
459 2007 Desember 14 Bandung PT Kayu Permata | Manager | Training | 
460 2007 Desember 15 Purwakarta PT Indokeramik | All Employee | Annual Meeting | 
461 2008 Januari 5-6 Jakarta PT Ciptakomunindo Pradipta | Staff-->Supervisor | Training | 
462 2008 Januari 14 Cipanas PT Sakafarma Indonesia | Staff | Training | 
463 2008 Januari 25-26 Jababeka PT Omron Manufacturing Indonesia Tbk. | Manager | Training | 
464 2008 Januari 26-27 Jakarta PT Ciptakomunindo Pradipta | Staff-->Supervisor | Training | 
465 2008 Januari 29-30 Cibubur PT Dipo Star Finance | Manager | Training | 
466 2008 Pebruari 13-14 Jakarta PT Fast food Indonesia | Manager & Staff | Training | 
467 2008 Pebruari 20-21 Jakarta PT Fast food Indonesia | Manager & Staff | Training | 
468 2008 Pebruari 23 Semarang PT Sakafarma Indonesia | Staff | Training | 
469 2008 Maret 8-9 Sidoardjo PT Interbat | Manager | Training | 
470 2008 Maret 15-16 Kalimantan PT Sawindo Kencana | Manager | Training | 
471 2008 Maret 18-19 Citeureup PT Indocement Tunggal Prakarsa | Pelaksana | Training | 
472 2008 Maret 29-30 Malang PT Interbat | Manager | Training | 
473 2008 April 4 Kalimantan PT Sawindo Kencana | Staf | Training | 
474 2008 April 11 Jakarta PT Dipo Star Finance | Manager | Training | 
475 2008 April 22-23 Citeureup PT Indocement Tunggal Prakarsa | Pelaksana | Training | 
476 2008 Mei 16-17 Tretes PT Interbat | Staf | Training | 
477 2008 Mei 26-27 Cibubur PT Fast Food Indonesia | Manager | Training | 
478 2008 Juni 10-11 Citeureup PT Indocement Tunggal Prakarsa | Pelaksana | Training | 
479 2008 Juni 28 Puncak PT Bank Dipo | Manager | Training | 
480 2008 Juni 26 Jakarta Public Course "Behaviour Relapse to Behaviour" | Manager | Training | 
481 2008 Juli 16 Jakarta Uji Coba BeTest | Manager | Test | `,

// Page 11 (482-532)
`482 2008 Juli 25-26 Jakarta PT First Jakarta International (BEJ) | Manager | Training | 
483 2008 Juli 28 Jakarta PT Prodia Laboratorium | Manager | Training | 
484 2008 Juli 31 Jakarta Uji Coba BeTest | Manager | Test | 
485 2008 Agustus 8 Bogor BeTest untuk Rekrutmen Karyawan dari STPP Oleh PT.Sawindo Kencana | Sarjana Pertanian | Test | 
486 2008 Agustus 23 Jakarta PT Dipo Star Finance | Manager | Training | 
487 2008 Oktober 18 Semarang PT Dipo Star Finance | Manager | Training | 
488 2008 Oktober 25 Surabaya PT Dipo Star Finance | Manager | Training | 
489 2008 Oktober 28-29 Jakarta PT Indocement Tunggal Prakarsa | Pelaksana | Training | 
490 2008 November 1 Bandung PT Dipo Star Finance | Manager | Training | 
491 2008 November 8 Palembang PT Dipo Star Finance | Manager | Training | 
492 2008 November 15 Medan PT Dipo Star Finance | Manager | Training | 
493 2008 November 22 Pekanbaru PT Dipo Star Finance | Manager | Training | 
494 2009 Januari 17 Cibubur PT Pundarika Atma Semesta | Staf - semua tingkatan | Training | 
495 2009 Januari 31 Cibubur PT Pundarika Atma Semesta | Staf - semua tingkatan | Training | 
496 2009 April 21-22 Citeureup PT Indocement Tunggal Prakarsa | Pelaksana | Training | 
497 2009 April 28-29 Citeureup PT Indocement Tunggal Prakarsa | Pelaksana | Training | 
498 2009 Mei 20 Jakarta Millenium Hotel Sirih Jakarta | Staf | Seminar Motivasi | 
499 2009 Juni 23-24 Citeureup PT Indocement Tunggal Prakarsa | Pelaksana | Training | 
500 2009 Agustus 19-20 Citeureup PT Indocement Tunggal Prakarsa | Pelaksana | Training | 
501 2009 September 29-30 Palimanan PT Indocement Tunggal Prakarsa | Pelaksana | Training | 
502 2009 Oktober 13-14 Citeureup PT Indocement Tunggal Prakarsa | Pelaksana | Training | 
503 2009 Oktober 21&23 Puncak PT Centranusa Insancemerlang | Staf | Training | 
504 2009 Oktober 28&30 Puncak PT Centranusa Insancemerlang | Staf | Training | 
505 2009 Oktober 26&29 Tangerang PT Inter Aneka Lestari Kimia | Staf | Training | 
506 2010 Maret 24&25 Citeureup PT Indocement Tunggal Prakarsa | Operator | Training | 
507 2010 April 20&21 Citeureup PT Indocement Tunggal Prakarsa | Operator | Training | 
508 2010 September 24-26 Palembang PT Sampoerna Agro Tbk. | Manajemen-Staf | Training | 
509 2010 Oktober 1 Cipayung UNIKA Atmajaya | Mahasiswa | BKAK | 
510 2010 Oktober 4-7 Puncak PT Centranusa Insancemerlang | Siswa SMP-SMA campuran | CPR | 
511 2010 Oktober 27 Puncak PT Centranusa Insancemerlang | Siswa SMP-SMA campuran | CPR | 
512 2010 Oktober 29 Bintaro-Jkt Sekolah Tirta Marta | Orang Tua siswa | Seminar | 
513 2010 November 3-5 Puncak PT Centranusa Insancemerlang | Siswa SMP-SMA campuran | CPR | 
514 2010 November 18-20 Puncak PT Centranusa Insancemerlang | Siswa SMP-SMA campuran | CPR | 
515 2011 Pebruari 11-12 Jakarta PT First Jakarta International (BEJ) | Manajemen-Staf | Training | 
516 2011 Pebruari 18-19 Jakarta PT First Jakarta International (BEJ) | Manajemen-Staf | Training | 
517 2011 Pebruari 16-17 Jakarta PT Expres Group (Expres Taxi) | Manajemen-Staf | Training | 
518 2011 Pebruari 22-23 Jakarta PT Expres Group (Expres Taxi) | Manajemen-Staf | Training | 
519 2011 Maret 3 Jakarta PT Pulauintan | Staf | Refreshing | 
520 2011 Maret 14-15 Cibitung PT Fajar Surya Wisesa | Manajemen-Staf | Training | 
521 2011 Maret 21-22 Cibitung PT Fajar Surya Wisesa | Manajemen-Staf | Training | 
522 2011 April 4-5 Cibitung PT Fajar Surya Wisesa | Manajemen-Staf | Training | 
523 2011 April 11-12 Cibitung PT Fajar Surya Wisesa | Manajemen-Staf | Training | 
524 2011 April 18-19 Cibitung PT Fajar Surya Wisesa | Manajemen-Staf | Training | 
525 2011 Mei 9-10 Cibitung PT Fajar Surya Wisesa | Manajemen-Staf | Training | 
526 2011 Mei 23-24 Cibitung PT Fajar Surya Wisesa | Manajemen-Staf | Training | 
527 2011 Juni 6-7 Cibitung PT Fajar Surya Wisesa | Manajemen-Staf | Training | 
528 2011 Juni 13-14 Cibitung PT Fajar Surya Wisesa | Manajemen-Staf | Training | 
529 2011 Juni 20-21 Cibitung PT Fajar Surya Wisesa | Manajemen-Staf | Training | 
530 2011 Juli 4-5 Cibitung PT Fajar Surya Wisesa | Manajemen-Staf | Training | 
531 2011 Juli 18-19 Cibitung PT Fajar Surya Wisesa | Manajemen-Staf | Training | 
532 2011 Oktober 8 Jakarta PT Sumatera Tobaco Trading Company | Manajemen-Staf | Training | `,

// Page 12 (533-582)
`533 2011 Oktober 13 & 14 Bandung PT Akur Pratama (Toserba Yogya) | Manajemen-Staf | Training | 
534 2011 November 11-12 Jakarta Tarra Group | Manajemen-Staf | Training | 
535 2011 November 12 Jakarta Seminar | Peserta Seminar | Seminar | 
536 2011 Desember 3 Puncak Gabungan Asosiasi Petani Perkebunan Ind | Pengurus dan Anggota | Rakernas | 
537 2011 Desember 6 Cibitung PT Fajar Surya Wisesa | Peserta pelatihan | Refreshing | 
538 2011 Desember 7-8 Jakarta Tarra Group | Manajemen | Training | 
539 2011 Desember 12-13 Jakarta Tarra Group | Manajemen-Staf | Training | 
540 2011 Desember 20-21 Jakarta Tarra Group | Staf | Training | 
541 2011 Desember 17-18 Jakarta PT Periuk Perkasa Abadi | Manajemen-Staf | Training | 
542 2012 Januari 31 Jakarta Kalbe Group | Staf | Training | 
543 2012 Pebruari 1 Jakarta Kalbe Group | Staf | Training | 
544 2012 Pebruari 4 & 6 Cikarang Kalbe Group | Staf | Training | 
545 2012 Pebruari 9 & 10 Cikarang Kalbe Group | Staf | Training | 
546 2012 Maret 12-13 Cikarang Kalbe Group | Staf | Training | 
547 2012 Maret 21-22 Cikarang Kalbe Group | Staf | Training | 
548 2012 Maret 26-27 Cikarang Kalbe Group | Staf | Training | 
549 2012 April 9-10 Cikarang Kalbe Group | Staf | Training | 
550 2012 April 11-12 Cikarang Kalbe Group | Staf | Training | 
551 2012 April 18-19 Cikarang Kalbe Group | Staf | Training | 
552 2012 April 23-24 Cikarang Kalbe Group | Staf | Training | 
553 2012 Mei 7-8 Cikarang Kalbe Group | Staf | Training | 
554 2012 Mei 24-25 Cikarang Kalbe Group | Staf | Training | 
555 2012 Mei 31 Cikarang Kalbe Group | Staf | Training | 
556 2012 Juni 1 Cikarang Kalbe Group | Staf | Training | 
557 2012 Juni 7-8 Cikarang Kalbe Group | Staf | Training | 
558 2012 Juni 11-12 Cikarang Kalbe Group | Staf | Training | 
559 2012 Juni 21-22 Cikarang Kalbe Group | Staf | Training | 
560 2012 Juli 9-10 Pulo Gadung Kalbe Group | Staf | Training | 
561 2012 Juli 23-24 Pulo Gadung Kalbe Group | Staf | Training | 
562 2012 Juli 30-31 Pulo Gadung Kalbe Group | Staf | Training | 
563 2012 September 5-6 Pulo Gadung Kalbe Group | Staf | Training | 
564 2012 September 10-11 Pulo Gadung Kalbe Group | Staf | Training | 
565 2012 September 24-25 Pulo Gadung Kalbe Group | Staf | Training | 
566 2012 Oktober 10-11 Pulo Gadung Kalbe Group | Staf | Training | 
567 2012 Oktober 22-23 Pulo Gadung Kalbe Group | Staf | Training | 
568 2012 Oktober 29-30 Pulo Gadung Kalbe Group | Staf | Training | 
569 2012 November 6-7 Pulo Gadung Kalbe Group | Staf | Training | 
570 2012 November 30 Kediri PT Agri Makmur Pertiwi | Staf | Training | 
571 2012 Desember 1 Kediri PT Agri Makmur Pertiwi | Staf | Training | 
572 2012 Desember 3-4 Kediri PT Agri Makmur Pertiwi | Staf | Training | 
573 2012 Desember 14-15 Cikarang PT Paxar Indonesia (Avery Dennison Group) | Manager | Training | 
574 2013 Januari 30-31 Yogyakarta PT Agri Makmur Pertiwi | Manager | Training | 
575 2013 April 2 & 3 Jakarta Bread Talk | Staf | Training | 
576 2013 April 10 & 11 Jakarta J'Co | Staf | Training | 
577 2013 Agustus 30 Jakarta PT Kalindo Land | Staf-Manager | Seminar | 
578 2013 Oktober 15 Jakarta PT Pulau Intan | Staf | Training | 
579 2013 Desember 13 Tg.Lesung PT Dwi Agung Sentosa Pratama | Staf-Manager | Training | 
580 2013 Desember 20-21 Puncak PT Supra Ferbindo Farma | Staf-Manager | Training | 
581 2014 Januari 15 Cikarang PT Omron Manufacturing of Indonesia | Staf | Behaviour Test | 
582 2014 Januari 16 Cikarang PT Omron Manufacturing of Indonesia | Staf | Behaviour Test | `,

// Page 13 (583-632)
`583 2014 Januari 17 Cikarang PT Omron Manufacturing of Indonesia | Staf | Behaviour Test | 
584 2014 Januari 20 Cikarang PT Omron Manufacturing of Indonesia | Staf | Behaviour Test | 
585 2014 Januari 21 Cikarang PT Omron Manufacturing of Indonesia | Staf | Behaviour Test | 
586 2014 Januari 22 Cikarang PT Omron Manufacturing of Indonesia | Staf | Behaviour Test | 
587 2014 Januari 23 Cikarang PT Omron Manufacturing of Indonesia | Staf | Behaviour Test | 
588 2014 Januari 30 Cikarang PT Omron Manufacturing of Indonesia | Staf | Behaviour Test | 
589 2014 Maret 14-16 Bogor PT Omron Manufacturing of Indonesia | Staf-Manager | Training | 
590 2014 April 8 Cikarang PT Omron Manufacturing of Indonesia | Staf | Behaviour Test | 
591 2014 April 10 Cikarang PT Omron Manufacturing of Indonesia | Staf | Behaviour Test | 
592 2014 Mei 23-24 Bogor PT United Chemicals Inter Aneka | Staf-Manager | Training | 
593 2014 Juni 17 Malang Universitas Brawijaya & Polinema Malang | Mahasiswa | Behaviour Test | 
594 2014 Juni 18 Surabaya Institut Teknologi Sepuluh November | Mahasiswa | Behaviour Test | 
595 2014 Oktober 11-12 Tangerang PT. United Chemicals Inter Aneka | Karyawan | Training | 
596 2014 Oktober 14-15 Cilegon PT Stollberg Samil Indonesia | Karyawan | Training | 
597 2014 Oktober 18-19 Tangerang PT. United Chemicals Inter Aneka | Karyawan | Training | 
598 2014 Oktober 31 Purwakarta PT. Lucky Indah Keramik | Karyawan | Training | 
599 2014 November 1 Purwakarta PT. Lucky Indah Keramik | Karyawan | Training | 
600 2014 November 5 Jakarta PT. Angkasa Pura II | Karyawan | Training | 
601 2014 November 20-21 Bekasi PT Padma Soode Indonesia | Karyawan | Training | 
602 2014 November 22 Jakarta PT Enseval Putra Megatrading | Karyawan | Training | 
603 2014 November 25-26 Cileungsi PT Padma Soode Indonesia | Karyawan | Training | 
604 2014 Desember 2-3 Cileungsi PT Padma Soode Indonesia | Karyawan | Training | 
605 2014 Desember 3-4 Palembang PT Swadaya Indopalma | Karyawan | Training | 
606 2014 Desember 5-6 Purwakarta PT Lucky Indah Keramik | Karyawan | Training | 
607 2014 Desember 9-10 Cileungsi PT Padma Soode Indonesia | Karyawan | Training | 
608 2014 Desember 13 Jakarta PT Enseval Putra Megatrading | Karyawan | Training | 
609 2014 Desember 16-17 Cileungsi PT Padma Soode Indonesia | Karyawan | Training | 
610 2014 Desember 20 Jakarta PT Enseval Putra Megatrading | Karyawan | Training | 
611 2015 Januari 5 Jakarta PT Enseval Putra Megatrading | Karyawan | Training | 
612 2015 Januari 10 Jakarta Paroki St.Robertus Cililitan | Umat Katholik Dkn. Jak Tim | Materi Sex Pasutri | 
613 2015 Januari 13-14 Cileungsi PT Padma Soode Indonesia | Karyawan | Training | 
614 2015 Januari 16-17 Purwakarta PT Lucky Indah Keramik | Karyawan | Training | 
615 2015 Januari 20-21 Cileungsi PT Padma Soode Indonesia | Karyawan | Training | 
616 2015 Januari 27-28 Cileungsi PT Padma Soode Indonesia | Karyawan | Training | 
617 2015 Januari 30-31 Purwakarta PT Lucky Indah Keramik | Karyawan | Training | 
618 2015 Pebruari 3-4 Cileungsi PT Padma Soode Indonesia | Karyawan | Training | 
619 2015 Pebruari 13-14 Purwakarta PT Lucky Indah Keramik | Karyawan | Training | 
620 2015 Pebruari 14 Jakarta PT Enseval Putra Megatrading | Karyawan | Training | 
621 2015 Pebruari 16-17 Palembang PT Swadaya Indopalma | Karyawan | Training | 
622 2015 Pebruari 18 Surabaya PT Omron Manufacturing of Indonesia | Calon Karyawan | Behaviour Test | 
623 2015 Pebruari 21 Jakarta PT Enseval Putra Megatrading | Karyawan | Training | 
624 2015 Pebruari 27-28 Purwakarta PT Lucky Indah Keramik | Karyawan | Training | 
625 2015 Pebruari 28 Jakarta PT Enseval Putra Megatrading | Karyawan | Training | 
626 2015 Maret 7 Jakarta PT Enseval Putra Megatrading | Karyawan | Training | 
627 2015 Maret 13-14 Purwakarta PT Lucky Indah Keramik | Karyawan | Training | 
628 2015 Maret 25 Jakarta PT Omron Manufacturing of Indonesia | Karyawan | Behaviour Test | 
629 2015 Maret 27-28 Purwakarta PT Lucky Indah Keramik | Karyawan | Training | 
630 2015 April 8 Bogor PT Enseval Putra Megatrading | Supervisor | Training | 
631 2015 April 12 Jakarta Paroki St.Robertus Cililitan | Umat Katholik Dkn. Jak Tim | Seminar Sex | 
632 2015 April 14-15 Cileungsi PT Padma Soode Indonesia | Manager | Training | `,

// Page 14 (633-681)
`633 2015 April 22 Cibitung PT Fajar Surya Wisesa | Karyawan | Training | 
634 2015 April 24 Ciawi PT Galic Artabahari | Direksi | Training | 
635 2015 Mei 5 Bandung PT BIG Group | Staf-Spv-Manager-Direksi | Training | 
636 2015 Des 16-17 Medan PT Sumatera Tobacco Trading Company | Marketing Staf | Training | 
637 2016 Januari 9 Jakarta Dekenat Timur Keuskupan Agung Jakarta | Calon Pasutri | Materi Sex Pasutri | 
638 2016 Januari 11 Sentul PT Kalbe Animal Health | Staf-Supervisor | Training | 
639 2016 Mei 16-17 Palangkaraya PT Karya Makmur Bahagia | Anggota & Pengurus Koperasi | Training | 
640 2016 Juli 18 Surabaya PT Enseval Putra Megatrading, Tbk. | Manager | Training | 
641 2016 Agustus 26 Puncak PT Kalbe Animal Health | Manager | Training | 
642 2017 Agustus 1-2 Ketapang PT Gunajaya Karya Gemilang | Anggota & Pengurus Koperasi | Training | 
643 2017 November 21-22 Metro Manggau PT Bumitama Gunajaya Abadi | Anggota & Pengurus Koperasi | Training | 
644 2018 Januari 23&24 Serang PT Indah Kiat Pulp and Paper, Tbk. | Para Guru se kab.Serang | Training CSR | 
645 2018 Maret 1 Serang PT Indah Kiat Pulp and Paper, Tbk. | Para Guru se kab.Serang | Training CSR | 
646 2018 April 22 Bogor PT Best Planter Indonesia | Para Planter | Training | 
647 2018 April 22 & 28 Bogor PT Best Planter Indonesia | Para Planter | Training | 
648 2018 Juni 25 Cibitung PT Fajar Surya Wisesa, Tbk | Karyawan | Training | 
649 2018 Juli 16 Cibitung PT Fajar Surya Wisesa, Tbk | Karyawan | Training | 
650 2018 September 4 & 6 Merauke PT Bio Inti Agrindo | Karyawan | Training | 
651 2018 September 25 Bogor STPP Bogor | Mahasiswa Pertanian | Behaviour Test | 
652 2018 September 29 Medan STTP Medan | Mahasiswa Pertanian | Behaviour Test | 
653 2018 Oktober 28 Yogya Polbangtan Yogyakarta Magelang | Mahasiswa Pertanian | Behaviour Test | 
654 2018 Oktober 30 Malang STTP Malang | Mahasiswa Pertanian | Behaviour Test | 
655 2018 November 3 Manokwari Polbangtan Manokwari | Mahasiswa Pertanian | Behaviour Test | 
656 2018 November 5 Gowa Polbangtan Gowa | Mahasiswa Pertanian | Behaviour Test | 
657 2018 November 23 Bogor PT Best Planter Indonesia | Planter | Training | 
658 2018 Desember 3 & 13 Bogor PT Best Planter Indonesia | Planter | Training | 
659 2019 Januari 23 Serang PT Indah Kiat Pulp and Paper, Tbk. | Para Guru se Kec.Tanara Serang | Program TSP | 
660 2019 Januari 28 Serang PT Indah Kiat Pulp and Paper, Tbk. | Para Guru se Kec.Carenang | Program TSP | 
661 2019 Januari 29 Serang PT Indah Kiat Pulp and Paper, Tbk. | Para Guru se Kec.Tirtayasa | Program TSP | 
662 2019 Februari 6 Serang PT Indah Kiat Pulp and Paper, Tbk. | Para Guru se Kec. Pontang | Program TSP | 
663 2019 Februari 7 Serang PT Indah Kiat Pulp and Paper, Tbk. | Para Guru se Kec. Cikande | Program TSP | 
664 2019 Februari 20 Serang PT Indah Kiat Pulp and Paper, Tbk. | Para Guru se kab.Serang | Refreshment Prog | 
665 2019 Maret 12-13 Palangkaraya PT Bumitama Gunajaya Abadi | Anggota & Pengurus Koperasi | Training | 
666 2019 Maret 25-26 Palangkaraya PT Bumitama Gunajaya Abadi | Anggota & Pengurus Koperasi | Training | 
667 2019 April 5-6 Palangkaraya PT Bumitama Gunajaya Abadi | Anggota & Pengurus Koperasi | Training | 
668 2019 April 12-13 Jakarta PT Garuda Metalindo | Karyawan | Training | 
669 2019 April 26-27 Palangkaraya PT Bumitama Gunajaya Abadi | Anggota & Pengurus Koperasi | Training | 
670 2019 April 26 Bogor PT Best Planter Indonesia | Planter | Training PAU | 
671 2019 Mei 3 - 4 Jakarta PT Garuda Metalindo | Karyawan | Training | 
672 2020 Februari 20-21 Jakarta PT XSmart | Staf-Manager | Training | 
673 2020 Agustus 18 Bogor PT Best Planter Indonesia | Planter | Training online | 
674 2021 Desember 13 Bandung RSUD Kemayoran | Staf-KaDiv | Training | 
675 2021 Desember 15 Kalimantan Barat PASPI - PT Bumitama Gunajaya Abadi | Karyawan dan Aparat Desa | Training | Mitra PT BGA
676 2021 Desember 16 Bandung RSUD Kemayoran | Staf-KaDiv | Training | 
677 2022 Maret 26 Cisarua PT Omron Manufacturing Indonesia | Supervisor | Seminar | 
678 2022 Agustus 22-23 Pasuruan PT Sorini Towa Berlian Corporindo | Operator-Foreman-Manager | Training | 
679 2022 Agustus 25-26 Pasuruan PT Sorini Towa Berlian Corporindo | Operator-Foreman-Manager | Training | 
680 2022 Agustus 29-30 Pasuruan PT Sorini Towa Berlian Corporindo | Operator-Foreman-Manager | Training | 
681 2023 Mei 7 Bogor PT Indoperkasa Sukses Jaya (INARE) | Staf-Manager dan Para Cedant | Seminar | `,

// Page 15 (682-711)
`682 2024 November 21-22 Bogor Kencana Agri | Manajer-Direksi | Seminar 1,5 hari | 
683 2025 Agustus 12-13 Kalimantan Selatan PT AKM & PT AIK (Area 2) | Karyawan Perkebunan Sawit | Training | AKM = Alamraya Kencana Mas
684 2025 Agustus 14-15 Kalimantan Selatan PT AKM & PT AIK (Area 2) | Karyawan Perkebunan Sawit | Training | 
685 2025 Agustus 20-21 Kalimantan Selatan PT AKM & PT AIK (Area 2) | Karyawan Perkebunan Sawit | Training | 
686 2025 Agustus 22-23 Kalimantan Selatan PT AKM & PT AIK (Area 2) | Karyawan Perkebunan Sawit | Training | 
687 2025 Agustus 25-26 Kalimantan Selatan PT AKM & PT AIK (Area 2) | Karyawan Perkebunan Sawit | Training | 
688 2025 Agustus 28-29 Kalimantan Selatan PT AKM & PT AIK (Area 2) | Karyawan Perkebunan Sawit | Training | 
689 2025 September 1-2 Kalimantan Selatan PT AKM & PT AIK (Area 2) | Karyawan Perkebunan Sawit | Training | 
690 2025 September 3-4 Kalimantan Selatan PT AKM & PT AIK (Area 2) | Karyawan Perkebunan Sawit | Training | 
691 2025 September 16-17 Kalimantan Timur PT SKL, PT AEK & PT ATK (Area 3) | Karyawan Perkebunan Sawit | Training | 
692 2025 September 19-20 Kalimantan Timur PT SKL, PT AEK & PT ATK (Area 3) | Karyawan Perkebunan Sawit | Training | 
693 2025 September 22-23 Kalimantan Timur PT SKL, PT AEK & PT ATK (Area 3) | Karyawan Perkebunan Sawit | Training | 
694 2025 September 24-25 Kalimantan Timur PT SKL, PT AEK & PT ATK (Area 3) | Karyawan Perkebunan Sawit | Training | 
695 2025 September 26-27 Kalimantan Timur PT SKL, PT AEK & PT ATK (Area 3) | Karyawan Perkebunan Sawit | Training | 
696 2025 Desember 9-10 Kalimantan Timur PT SKL, PT AEK & PT ATK (Area 3) | Karyawan Perkebunan Sawit | Training | 
697 2025 Desember 11-12 Kalimantan Timur PT SKL, PT AEK & PT ATK (Area 3) | Karyawan Perkebunan Sawit | Training | 
698 2025 Desember 15-16 Kalimantan Timur PT SKL, PT AEK & PT ATK (Area 3) | Karyawan Perkebunan Sawit | Training | 
699 2025 Desember 17-18 Kalimantan Timur PT SKL, PT AEK & PT ATK (Area 3) | Karyawan Perkebunan Sawit | Training | 
700 2025 Oktober 7-8 Gorontalo PT STN & PT LIL (Area 4) | Karyawan Perkebunan Sawit | Training | 
701 2025 Oktober 9-10 Gorontalo PT STN & PT LIL (Area 4) | Karyawan Perkebunan Sawit | Training | 
702 2025 Oktober 13-14 Gorontalo PT STN & PT LIL (Area 4) | Karyawan Perkebunan Sawit | Training | 
703 2025 Oktober 15-16 Gorontalo PT STN & PT LIL (Area 4) | Karyawan Perkebunan Sawit | Training | 
704 2025 Oktober 28-29 Sulawesi Tengah PT WMP, PT DSP, PT SCEM (Area 5) | Karyawan Perkebunan Sawit | Training | 
705 2025 Oktober 30-31 Sulawesi Tengah PT WMP, PT DSP, PT SCEM (Area 5) | Karyawan Perkebunan Sawit | Training | 
706 2025 November 3-4 Sulawesi Tengah PT WMP, PT DSP, PT SCEM (Area 5) | Karyawan Perkebunan Sawit | Training | 
707 2025 November 5-6 Sulawesi Tengah PT WMP, PT DSP, PT SCEM & PT BWS (Area 5) | Karyawan Perkebunan Sawit | Training | 
708 2025 November 24-25 Bangka PT SWK & PT BWS | Karyawan Perkebunan Sawit | Training | 
709 2025 November 26-27 Bangka PT SWK & PT BWS | Karyawan Perkebunan Sawit | Training | 
710 2025 November 28-29 Bangka PT SWK & PT BWS | Karyawan Perkebunan Sawit | Training | 
711 2025 Desember 4-5 Bangka PT SWK & PT BWS | Karyawan Perkebunan Sawit | Training | `
];

const allRecords = [];

pagesRaw.forEach((pageStr) => {
  const lines = pageStr.trim().split('\n').filter(l => l.trim().length > 0);
  lines.forEach((line) => {
    // Format: No Tahun Bulan Tanggal Kota Perusahaan | Peserta | Training/Follow up | Keterangan
    const parts = line.split('|').map(s => s.trim());
    const headerPart = parts[0];
    const peserta = parts[1] || '';
    const tipe = parts[2] || 'Training';
    const keterangan = parts[3] || '';

    const tokens = headerPart.split(/\s+/);
    const no = parseInt(tokens[0], 10);
    const tahun = tokens[1];
    const bulan = tokens[2];
    
    let dateIdx = 3;
    let tanggal = tokens[dateIdx];
    dateIdx++;
    if (tokens[dateIdx] && /^[0-9&,\-]+$/.test(tokens[dateIdx])) {
      tanggal += ' ' + tokens[dateIdx];
      dateIdx++;
    }

    const remainingTokens = tokens.slice(dateIdx);
    
    // Find city and company
    const multiWordCities = [
      'Nusa Dua, Bali', 'Pangkal Pinang', 'Kalimantan Selatan', 'Kalimantan Timur',
      'Kalimantan Barat', 'Sulawesi Tengah', 'Anyer-Banten', 'Rumbai-PKU',
      'Bintaro-Jkt', 'Tg.Lesung', 'Metro Manggau', 'Pulo Gadung', 'Mega Mendung'
    ];
    
    let kota = '';
    let perusahaan = '';
    const remStr = remainingTokens.join(' ');
    
    let matchedMultiCity = multiWordCities.find(c => remStr.toLowerCase().startsWith(c.toLowerCase()));
    if (matchedMultiCity) {
      kota = matchedMultiCity;
      perusahaan = remStr.slice(matchedMultiCity.length).trim();
    } else {
      kota = remainingTokens[0];
      perusahaan = remainingTokens.slice(1).join(' ').trim();
    }

    allRecords.push({
      no,
      tahun,
      bulan,
      tanggal,
      kota,
      perusahaan,
      peserta,
      tipe,
      keterangan
    });
  });
});

console.log(`Successfully parsed ${allRecords.length} records!`);
console.log(`First record:`, allRecords[0]);
console.log(`Last record:`, allRecords[allRecords.length - 1]);

// Write to assets/js/training-data.js
const fileContent = `/**
 * KPPSM F.X. POERWOPOESPITO
 * Data Pengalaman Presentasi & Pelatihan Sikap Mental (1992 - 2025)
 * Total ${allRecords.length} Data Pelatihan Resmi dari Arsip KPPSM
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.KPPSM_TRAINING_DATA = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  return ${JSON.stringify(allRecords, null, 2)};
}));
`;

fs.writeFileSync(path.join(__dirname, '../assets/js/training-data.js'), fileContent, 'utf8');
console.log('Saved to assets/js/training-data.js successfully!');
