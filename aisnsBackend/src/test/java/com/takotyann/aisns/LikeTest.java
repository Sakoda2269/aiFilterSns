package com.takotyann.aisns;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@AutoConfigureMockMvc
@SpringBootTest()
public class LikeTest {

	@Autowired
	private MockMvc mockMvc;
	
	@Test
	public void likeTest() throws Exception {
		AccountForTest account1 = new AccountForTest("jdsffdsjka", "sakoda1", "fdjsjfdksajkfds", mockMvc);
		AccountForTest account2 = new AccountForTest("jdsffdsjka2", "sakoda2", "fdjsjfdksajkfds", mockMvc);
		AccountForTest account3 = new AccountForTest("jdsffdsjka3", "sakoda3", "fdjsjfdksajkfds", mockMvc);
		
		String pid1 = account1.posts("hello world");
		account3.posts("good day");
		account2.like(pid1);
		account2.follow(account1);
		System.out.println(account2.getLikedPosts());
		assertEquals(account2.getLikedPosts().size(), 1);
		for(var post : account2.getTimeLine()) {
			System.out.println(post);
		}
	}
	
}
